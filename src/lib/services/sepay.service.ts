import { prisma } from "@/lib/prisma";
import { sendAppointmentConfirmationEmail } from "@/lib/services/appointment-email.service";
import { extractAppointmentId, generateVietQRUrl } from "@/lib/sepay/sepay.utils";
import { Prisma } from "@prisma/client";
import { SepayWebhookPayload } from "../sepay/sepay.types";

interface PaymentInstructionInput {
  appointmentId: string;
  amount: number | string | Prisma.Decimal;
}


export function getPaymentService() {
  return {
    paymentInstructions(payment: PaymentInstructionInput) {
      const amount = Number(payment.amount);

      const qrUrl = generateVietQRUrl(
        amount,
        payment.appointmentId,
      );

      return {
        appointmentId: payment.appointmentId,
        amount,
        qrUrl,
      };
    },
    async handleWebhook(
      authorization: string | null,
      payload: unknown,
    ) {
      const apiKey = process.env.SEPAY_API_KEY;

      if (!apiKey || authorization !== `Apikey ${apiKey}`) {
        throw new Error("UNAUTHORIZED");
      }

      return processSepayWebhookService(
        payload as SepayWebhookPayload,
      );
    },
  };

}

export async function processSepayWebhookService(
  payload: SepayWebhookPayload,
) {
  if (payload.transferType !== "in") {
    return { success: true, message: "IGNORED_OUTGOING_TRANSACTION" };
  }

  if (
    !Number.isSafeInteger(payload.id) ||
    !Number.isSafeInteger(payload.transferAmount) ||
    payload.transferAmount <= 0
  ) {
    return { success: true, message: "INVALID_TRANSACTION_DATA" };
  }

  const appointmentId = extractAppointmentId(
    payload.code,
    payload.content,
  );

  if (!appointmentId) {
    return {
      success: true,
      message: "APPOINTMENT_ID_NOT_FOUND",
    };
  }

  const payment = await prisma.payment.findUnique({
    where: { appointmentId },
    select: {
      id: true,
      amount: true,
      status: true,
      expiresAt: true,
      appointmentId: true,
    },
  });

  if (!payment) {
    return { success: true, message: "PAYMENT_NOT_FOUND" };
  }

  const transactionDate = payload.transactionDate
    ? new Date(`${payload.transactionDate.replace(" ", "T")}+07:00`)
    : null;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // UNIQUE sepayTransactionId chống webhook trùng.
      await tx.paymentTransaction.create({
        data: {
          paymentId: payment.id,
          sepayTransactionId: String(payload.id),
          transferAmount: new Prisma.Decimal(payload.transferAmount),
          transferType: payload.transferType,
          referenceCode: payload.referenceCode || null,
          transactionDate:
            transactionDate && !Number.isNaN(transactionDate.getTime())
              ? transactionDate
              : null,
          isMatched: false,
          rawPayload: payload as unknown as Prisma.InputJsonValue,
        },
      });

      const now = new Date();

      // Không tự xác nhận nếu số tiền không chính xác.
      const expectedAmount = Number(payment.amount);

      if (payload.transferAmount !== expectedAmount) {
        return {
          success: true,
          message: "AMOUNT_MISMATCH",
        };
      }

      // Chỉ chấp nhận Payment đang PENDING và còn hạn.
      if (payment.status !== "PENDING" || payment.expiresAt <= now) {
        if (payment.status === "PENDING") {
          const expiredPayment = await tx.payment.updateMany({
            where: { id: payment.id, status: "PENDING" },
            data: { status: "EXPIRED" },
          });
          if (expiredPayment.count === 0) {
            return { success: true, message: "PAYMENT_ALREADY_PROCESSED" };
          }

          await tx.appointment.updateMany({
            where: {
              id: payment.appointmentId,
              status: "PENDING_PAYMENT",
            },
            data: { status: "EXPIRED" },
          });
        }

        return {
          success: true,
          message: "PAYMENT_EXPIRED_OR_ALREADY_PROCESSED",
        };
      }

      // Conditional update tránh hai webhook đồng thời cùng xác nhận.
      const updatedPayment = await tx.payment.updateMany({
        where: {
          id: payment.id,
          status: "PENDING",
          expiresAt: { gt: now },
        },
        data: {
          status: "PAID",
          paidAt: now,
        },
      });

      if (updatedPayment.count === 0) {
        return {
          success: true,
          message: "PAYMENT_ALREADY_PROCESSED",
        };
      }

      const updatedAppointment = await tx.appointment.updateMany({
        where: {
          id: payment.appointmentId,
          status: "PENDING_PAYMENT",
        },
        data: {
          status: "CONFIRMED",
        },
      });

      if (updatedAppointment.count === 0) {
        throw new Error("APPOINTMENT_STATUS_CHANGED");
      }

      await tx.paymentTransaction.update({
        where: {
          sepayTransactionId: String(payload.id),
        },
        data: {
          isMatched: true,
        },
      });

      return {
        success: true,
        message: "PAYMENT_CONFIRMED",
      };
    });

    if (result.message === "PAYMENT_CONFIRMED") {
      await sendPaidAppointmentEmail(payment.appointmentId);
    }
    return result;
  } catch (error) {
    // SePay có thể gửi lại cùng một giao dịch.
    // P2002 là lỗi unique do giao dịch đã được ghi nhận.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: true,
        message: "DUPLICATE_TRANSACTION",
      };
    }

    throw error;
  }
}

async function sendPaidAppointmentEmail(appointmentId: string) {
  try {
    const appointment = await prisma.appointment.findUniqueOrThrow({
      where: { id: appointmentId },
      select: {
        startAt: true,
        endAt: true,
        patient: { select: { managedBy: { select: { email: true } } } },
        doctor: { select: { name: true } },
        service: { select: { name: true, price: true } },
      },
    });
    const timeZone = "Asia/Ho_Chi_Minh";
    const durationMinutes = (appointment.endAt.getTime() - appointment.startAt.getTime()) / 60_000;
    const { error } = await sendAppointmentConfirmationEmail(
      appointment.patient.managedBy.email,
      {
        doctorName: appointment.doctor.name,
        appointmentDate: appointment.startAt.toLocaleDateString("vi-VN", {
          timeZone, day: "2-digit", month: "2-digit", year: "numeric",
        }),
        appointmentTime: appointment.startAt.toLocaleTimeString("vi-VN", {
          timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
        }),
        appointmentType: appointment.service?.name ?? "Khám nha khoa",
        duration: `${durationMinutes} phút`,
        price: appointment.service
          ? appointment.service.price.toNumber().toLocaleString("vi-VN", {
            style: "currency", currency: "VND",
          })
          : "—",
      },
    );
    if (error) throw error;
  } catch (error) {
    console.error("Failed to send appointment confirmation email", appointmentId, error);
  }
}

export function getDepositAmount(servicePrice: number) {
  const amount = Number(process.env.SEPAY_DEPOSIT_VND);
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error("SEPAY_DEPOSIT_VND_INVALID");
  }
  if (!Number.isSafeInteger(servicePrice) || servicePrice <= 0) {
    throw new Error("SERVICE_PRICE_INVALID");
  }
  return Math.min(amount, servicePrice);
}
