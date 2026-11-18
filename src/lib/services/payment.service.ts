import { Prisma } from "@prisma/client";
import { extractAppointmentId, generatePaymentCode } from "@/lib/sepay/sepay.utils";
import { SepayWebhookPayload } from "../sepay/sepay.types";
import { prisma } from "@/lib/prisma";
const PAYMENT_EXPIRE_MINUTES = Number(
  process.env.SEPAY_PAYMENT_EXPIRE_MINUTES || 15,
);

export async function createPaymentService(
  tx: Prisma.TransactionClient,
  appointmentId: string,
  amount: Prisma.Decimal,
  expiresAt?: Date,
) {
  const paymentCode = generatePaymentCode();

  const paymentExpiresAt =
    expiresAt ??
    new Date(Date.now() + PAYMENT_EXPIRE_MINUTES * 60_000);

  return tx.payment.create({
    data: {
      appointmentId,
      paymentCode,
      amount,
      expiresAt: paymentExpiresAt,
      status: "PENDING",
      provider: "SEPAY",
    },
  });
}


/**
 * Cho frontend kiểm tra trạng thái thanh toán.
 */
export async function getPaymentStatusService(appointmentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { appointmentId },
    select: {
      status: true,
      amount: true,
      paymentCode: true,
      expiresAt: true,
      paidAt: true,
      appointment: {
        select: {
          patient: {
            select: {
              managedById: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new Error("PAYMENT_NOT_FOUND");
  }

  return {
    status: payment.status,
    amount: payment.amount.toString(),
    paymentCode: payment.paymentCode,
    expiresAt: payment.expiresAt,
    paidAt: payment.paidAt,
  };
}