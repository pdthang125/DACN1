import { auth } from "@clerk/nextjs/server";
import { AppointmentStatus, Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPaymentService } from "./sepay.service";
import {
  createPaymentService,
} from "@/lib/services/payment.service";

function occupyingAppointments(now: Date): Prisma.AppointmentWhereInput {
  return {
    OR: [
      { status: { in: ["CONFIRMED", "IN_PROGRESS", "RESCHEDULE_PENDING"] } },
      {
        status: "PENDING_PAYMENT",
        payment: { is: { status: "PENDING", expiresAt: { gt: now } } },
      },
    ],
  };
}
interface AppointmentForView {
  startAt: Date;
  patient?: {
    fullName: string;
    phone?: string | null;
    managedBy?: { email: string } | null;
  } | null;
  doctor?: { name: string; imageUrl?: string | null } | null;
}

export interface PatientInput {
  fullName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone?: string;
  nationalId?: string;
  address?: string;
  emergencyContact?: string;
  bloodType?: string;
  allergies?: string;
  medicalAlerts?: string;
  isPrimary: boolean;
}

export interface AvailableTimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface BookAppointmentRequest {
  doctorId: string;
  date: string;
  time: string;

  serviceId?: string;
  roomId?: string;

  patientId?: string;
  patient?: PatientInput;

  symptom: string;
  notes?: string;
  phoneNumber?: string;
}
interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

export function parseDateTime(dateStr: string, timeStr: string): Date {
  if (dateStr.includes("T")) return new Date(dateStr);
  return new Date(`${dateStr}T${timeStr}:00+07:00`);
}

export function formatTimeHHmm(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatDateYYYYMMDD(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function getVietnamDayOfWeek(dateStr: string): number {
  const date = parseDateTime(dateStr, "12:00");
  const weekdayStr = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    weekday: "short",
  }).format(date);
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return weekdayMap[weekdayStr] ?? date.getDay();
}

function transformAppointment<T extends AppointmentForView>(appointment: T) {
  return {
    ...appointment,
    patientName: appointment.patient?.fullName ?? "",
    patientEmail: appointment.patient?.managedBy?.email ?? "",
    doctorName: appointment.doctor?.name ?? "",
    doctorImageUrl: appointment.doctor?.imageUrl ?? "",
    date: formatDateYYYYMMDD(appointment.startAt),
    time: formatTimeHHmm(appointment.startAt),
  };
}

async function requireAuthenticatedUser(): Promise<AuthenticatedUser> {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("UNAUTHORIZED");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, role: true },
  });

  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
}

/** Fetch appointments for the staff/admin appointment-management screen. */
export async function getAppointmentsService() {
  const currentUser = await requireAuthenticatedUser();
  if (currentUser.role !== "ADMIN") throw new Error("FORBIDDEN");

  const appointments = await prisma.appointment.findMany({
    include: {
      patient: {
        select: {
          fullName: true,
          phone: true,
          managedBy: { select: { email: true } },
        },
      },
      doctor: { select: { name: true, imageUrl: true } },
      service: { select: { id: true, name: true, durationMinutes: true, price: true } },
      room: { select: { id: true, name: true, roomNumber: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return appointments.map(transformAppointment);
}

/** Fetch appointments belonging to patient profiles managed by the signed-in user. */
export async function getUserAppointmentsService() {
  const user = await requireAuthenticatedUser();

  const appointments = await prisma.appointment.findMany({
    where: { patient: { managedById: user.id } },
    include: {
      payment: true,
      patient: {
        select: {
          fullName: true,
          phone: true,
          managedBy: { select: { email: true } },
        },
      },
      doctor: { select: { name: true, imageUrl: true } },
      service: { select: { id: true, name: true, durationMinutes: true, price: true } },
      room: { select: { id: true, name: true, roomNumber: true } },
    },
    orderBy: { startAt: "asc" },
  });

  return appointments.map(({ payment, ...appointment }) => {
    const expiry = payment?.expiresAt;
    const waiting = appointment.status === AppointmentStatus.PENDING_PAYMENT && payment?.status === "PENDING";
    const paymentExpired = waiting && !!expiry && expiry <= new Date();
    const instructions = waiting && payment && !paymentExpired
      ? { ...getPaymentService().paymentInstructions(payment), expiresAt: expiry?.toISOString() ?? null }
      : null;
    return {
      ...transformAppointment(appointment),
      service: appointment.service && { ...appointment.service, price: appointment.service.price.toNumber() },
      payment: instructions,
      paymentExpired,
    };
  });
}


export async function getUserAppointmentStatsService() {
  const emptyStats = {
    totalAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: 0,
    cancelledAppointments: 0,
  };

  const { userId: clerkId } = await auth();
  if (!clerkId) return emptyStats;

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) return emptyStats;

  const patientFilter = { patient: { managedById: user.id } };
  const now = new Date();

  const [totalAppointments, completedAppointments, upcomingAppointments, cancelledAppointments] =
    await Promise.all([
      prisma.appointment.count({ where: patientFilter }),
      prisma.appointment.count({ where: { ...patientFilter, status: "COMPLETED" } }),
      prisma.appointment.count({
        where: {
          ...patientFilter,
          status: "CONFIRMED",
          startAt: { gte: now },
        },
      }),
      prisma.appointment.count({ where: { ...patientFilter, status: "CANCELLED" } }),
    ]);

  return {
    totalAppointments,
    completedAppointments,
    upcomingAppointments,
    cancelledAppointments,
  };
}

export async function getDoctorAvailableTimeSlotsService(
  doctorId: string,
  date: string,
  serviceId?: string,
): Promise<AvailableTimeSlot[]> {
  if (!doctorId || !date) return [];

  const { startOfDay: dayStart, endOfDay: dayEnd } =
    getVietnamDayRange(date);

  // 1. Kiểm tra bác sĩ có đang hoạt động không
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: { id: true, isActive: true },
  });
  if (!doctor || !doctor.isActive) {
    return [];
  }

  // 2. Xác định thời lượng dịch vụ (phút)
  let durationMinutes = 30;
  if (serviceId) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { durationMinutes: true, isActive: true },
    });
    if (
      !service ||
      !service.isActive ||
      service.durationMinutes <= 0
    ) {
      return [];
    }

    durationMinutes = service.durationMinutes;
  }

  // 3. Lấy lịch làm việc định kỳ của bác sĩ theo thứ trong tuần
  const dayOfWeek = getVietnamDayOfWeek(date);
  const customSchedule = await prisma.doctorSchedule.findFirst({
    where: {
      doctorId,
      dayOfWeek,
      isActive: true,
      effectiveFrom: { lte: dayStart },
      OR: [
        { effectiveTo: null },
        { effectiveTo: { gte: dayStart } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  // Kiểm tra biến động lịch trong ngày (Override)
  const scheduleOverride = await prisma.doctorScheduleOverride.findFirst({
    where: {
      doctorId,
      date: dayStart,
    },
  });

  // Cấu hình ca làm việc (ưu tiên Override -> Custom Schedule -> Mặc định phòng khám 08:30 - 17:30)
  let startTime = customSchedule?.startTime || "08:30";
  let endTime = customSchedule?.endTime || "17:30";
  let breakStart = customSchedule?.breakStart || "12:00";
  let breakEnd = customSchedule?.breakEnd || "13:30";
  let slotDuration = customSchedule?.slotDuration || 30;

  if (scheduleOverride) {
    if (scheduleOverride.startTime) startTime = scheduleOverride.startTime;
    if (scheduleOverride.endTime) endTime = scheduleOverride.endTime;
  }

  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);
  const breakStartMin = breakStart ? timeToMinutes(breakStart) : null;
  const breakEndMin = breakEnd ? timeToMinutes(breakEnd) : null;

  // 4. Lấy các khoảng thời gian nghỉ phép / vắng mặt đã duyệt của bác sĩ
  const timeOffs = await prisma.doctorTimeOff.findMany({
    where: {
      doctorId,
      isApproved: true,
      startAt: { lt: dayEnd },
      endAt: { gt: dayStart },
    },
    select: {
      startAt: true,
      endAt: true,
      reason: true,
    },
  });

  // 5. Lấy các lịch hẹn đã đặt trong ngày của bác sĩ
  const bookedAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      startAt: { lt: dayEnd },
      endAt: { gt: dayStart },
      status: { in: ["CONFIRMED", "IN_PROGRESS", "RESCHEDULE_PENDING"] },
    },
    select: {
      startAt: true,
      endAt: true,
    },
  });

  // 6. Sinh các khung giờ khám
  const slots: AvailableTimeSlot[] = [];
  const now = new Date();
  const bookingBufferMs = 15 * 60 * 1000; // Đặt trước tối thiểu 15 phút

  for (let currentMin = startMin; currentMin + durationMinutes <= endMin; currentMin += slotDuration) {
    // Bỏ qua nếu thời gian slot giao cắt với giờ nghỉ trưa
    if (breakStartMin !== null && breakEndMin !== null) {
      const slotOverlapBreak = currentMin < breakEndMin && (currentMin + durationMinutes) > breakStartMin;
      if (slotOverlapBreak) {
        continue;
      }
    }

    const timeStr = minutesToTime(currentMin);
    const slotStart = parseDateTime(date, timeStr);
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60_000);

    // Kiểm tra giờ đã qua (nếu là ngày hôm nay)
    const isPast = slotStart.getTime() <= now.getTime() + bookingBufferMs;

    // Kiểm tra trùng với lịch nghỉ phép của bác sĩ
    const isTimeOff = timeOffs.some(
      (to) => slotStart < to.endAt && slotEnd > to.startAt,
    );

    // Kiểm tra trùng với lịch hẹn bệnh nhân khác đã đặt
    const isBooked = bookedAppointments.some(
      (app) => slotStart < app.endAt && slotEnd > app.startAt,
    );

    let reason: string | undefined = undefined;
    if (isPast) {
      reason = "Đã qua khung giờ khám";
    } else if (isTimeOff) {
      reason = "Bác sĩ nghỉ phép";
    } else if (isBooked) {
      reason = "Đã có người đặt";
    }

    slots.push({
      time: timeStr,
      available: !isPast && !isTimeOff && !isBooked,
      reason,
    });
  }

  return slots;
}

export async function getBookedTimeSlotsService(
  doctorId: string,
  date: string,
  serviceId?: string,
) {
  const slots = await getDoctorAvailableTimeSlotsService(doctorId, date, serviceId);
  return slots.filter((slot) => !slot.available).map((slot) => slot.time);
}

export async function bookAppointmentService(
  input: BookAppointmentRequest,
) {
  const user = await requireAuthenticatedUser();

  if (!input.doctorId || !input.date || !input.time || !input.serviceId) {
    throw new Error("BOOKING_INFORMATION_REQUIRED");
  }

  const startAt = parseDateTime(input.date, input.time);

  if (Number.isNaN(startAt.getTime())) {
    throw new Error("INVALID_APPOINTMENT_DATE_TIME");
  }

  if (startAt <= new Date()) {
    throw new Error("APPOINTMENT_MUST_BE_IN_FUTURE");
  }

  return prisma.$transaction(async (tx) => {
    // 1. Lấy Patient
    let patient = input.patientId
      ? await tx.patient.findFirst({
        where: {
          id: input.patientId,
          managedById: user.id,
        },
      })
      : null;

    if (!patient && input.patient) {
      patient = await tx.patient.create({
        data: {
          fullName: input.patient.fullName,
          dateOfBirth: new Date(input.patient.dateOfBirth),
          gender: input.patient.gender || "OTHER",
          phone: input.patient.phone || input.phoneNumber || null,
          nationalId: input.patient.nationalId || null,
          address: input.patient.address || null,
          emergencyContact: input.patient.emergencyContact || null,
          bloodType: input.patient.bloodType || null,
          allergies: input.patient.allergies || null,
          medicalAlerts: input.patient.medicalAlerts || null,
          isPrimary: input.patient.isPrimary ?? true,
          managedById: user.id,
        },
      });
    }

    if (!patient) {
      patient = await tx.patient.findFirst({
        where: { managedById: user.id },
        orderBy: [
          { isPrimary: "desc" },
          { createdAt: "asc" },
        ],
      });
    }

    if (!patient) {
      throw new Error("PATIENT_PROFILE_NOT_FOUND");
    }

    // 2. Lấy Doctor
    const doctor = await tx.doctor.findUnique({
      where: { id: input.doctorId },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!doctor?.isActive) {
      throw new Error("DOCTOR_NOT_AVAILABLE");
    }

    // 3. Lấy Service để tính tiền và thời lượng
    const service = await tx.service.findUnique({
      where: { id: input.serviceId },
      select: {
        id: true,
        name: true,
        durationMinutes: true,
        price: true,
        isActive: true,
      },
    });

    if (!service?.isActive) {
      throw new Error("SERVICE_NOT_AVAILABLE");
    }

    if (
      service.durationMinutes <= 0 ||
      service.price.lessThanOrEqualTo(0)
    ) {
      throw new Error("INVALID_SERVICE_CONFIGURATION");
    }

    const amount = service.price;

    // VietQR yêu cầu số tiền nguyên VND.
    if (
      !Number.isSafeInteger(amount.toNumber()) ||
      amount.toNumber() <= 0
    ) {
      throw new Error("INVALID_PAYMENT_AMOUNT");
    }

    const endAt = new Date(
      startAt.getTime() + service.durationMinutes * 60_000,
    );

    // 4. Tạo Appointment
    const appointment = await tx.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        serviceId: service.id,
        startAt,
        endAt,
        symptom: input.symptom || "Khám tổng quát",
        phoneNumber: input.phoneNumber || patient.phone || null,
        notes: input.notes ?? null,
        status: "PENDING_PAYMENT",
        ...(input.roomId ? { roomId: input.roomId } : {}),
      },
      include: {
        patient: {
          select: {
            fullName: true,
            phone: true,
            managedBy: {
              select: { email: true },
            },
          },
        },
        doctor: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            durationMinutes: true,
            price: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
          },
        },
      },
    });

    // 5. Tính hạn thanh toán
    const paymentExpireMinutes = Number(
      process.env.SEPAY_PAYMENT_EXPIRE_MINUTES || 15,
    );

    if (
      !Number.isSafeInteger(paymentExpireMinutes) ||
      paymentExpireMinutes <= 0
    ) {
      throw new Error("SEPAY_PAYMENT_EXPIRE_MINUTES_INVALID");
    }

    const now = new Date();

    const expiresAt = new Date(
      Math.min(
        startAt.getTime(),
        now.getTime() + paymentExpireMinutes * 60_000,
      ),
    );

    // 6. Tạo Payment
    const payment = await createPaymentService(
      tx,
      appointment.id,
      amount,
      expiresAt,
    );

    // 7. Sinh QR
    const paymentInfo = getPaymentService().paymentInstructions({
      appointmentId: payment.paymentCode,
      amount: payment.amount.toNumber(),
    });

    return {
      ...transformAppointment(appointment),

      service: appointment.service
        ? {
          ...appointment.service,
          price: appointment.service.price.toNumber(),
        }
        : null,

      payment: {
        ...paymentInfo,
        status: payment.status,
        expiresAt: payment.expiresAt.toISOString(),
      },
    };
  });
}
async function getAppointmentContext(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: {
      id: true,
      status: true,
      startAt: true,
      patient: { select: { managedById: true } },
      doctor: { select: { userId: true } },
    },
  });
  if (!appointment) throw new Error("APPOINTMENT_NOT_FOUND");
  return appointment;
}

function assertCanManageAppointment(
  user: AuthenticatedUser,
  appointment: Awaited<ReturnType<typeof getAppointmentContext>>,
) {
  const isAdmin = user.role === "ADMIN";
  const isPatientOwner = appointment.patient.managedById === user.id;
  const isAssignedDoctor = appointment.doctor.userId === user.id;

  if (!isAdmin && !isPatientOwner && !isAssignedDoctor) {
    throw new Error("FORBIDDEN");
  }
}

async function transitionAppointmentStatus(args: {
  appointmentId: string;
  expectedStatus: AppointmentStatus;
  nextStatus: AppointmentStatus;
  cancellationReason?: string;
  cancelledByRole?: UserRole;
}) {
  const user = await requireAuthenticatedUser();
  const appointment = await getAppointmentContext(args.appointmentId);
  assertCanManageAppointment(user, appointment);

  if (appointment.status !== args.expectedStatus) {
    throw new Error("INVALID_APPOINTMENT_STATUS_TRANSITION");
  }

  if (args.nextStatus === "NO_SHOW" && appointment.startAt > new Date()) {
    throw new Error("APPOINTMENT_NOT_STARTED_YET");
  }

  await prisma.$transaction(async (tx) => {
    if (args.expectedStatus === "PENDING_PAYMENT") {
      // Khóa bản ghi thanh toán trước, cùng thứ tự với webhook SePay.
      const payment = await tx.payment.updateMany({
        where: { appointmentId: args.appointmentId, status: "PENDING" },
        data: { status: "FAILED" },
      });
      if (payment.count === 0) throw new Error("PAYMENT_STATUS_CHANGED");
    }

    const result = await tx.appointment.updateMany({
      where: { id: args.appointmentId, status: args.expectedStatus },
      data: {
        status: args.nextStatus,
        ...(args.nextStatus === "CANCELLED"
          ? {
            cancellationReason: args.cancellationReason ?? null,
            cancelledAt: new Date(),
            cancelledByRole: args.cancelledByRole ?? user.role,
          }
          : {}),
      },
    });
    if (result.count === 0) throw new Error("APPOINTMENT_STATUS_CHANGED_CONCURRENTLY");
  });

  if (args.expectedStatus === "PENDING_PAYMENT") return;

  return prisma.appointment.findUnique({
    where: { id: args.appointmentId },
    include: {
      patient: {
        select: {
          fullName: true,
          phone: true,
          managedBy: { select: { email: true } },
        },
      },
      doctor: { select: { name: true, imageUrl: true } },
      service: { select: { id: true, name: true, durationMinutes: true, price: true } },
      room: { select: { id: true, name: true, roomNumber: true } },
    },
  });
}

export async function cancelAppointmentService(input: {
  appointmentId: string;
  cancellationReason?: string;
  expectedStatus?: "CONFIRMED" | "PENDING_PAYMENT";
}) {
  const expectedStatus = input.expectedStatus ?? "CONFIRMED";
  if (expectedStatus !== "CONFIRMED" && expectedStatus !== "PENDING_PAYMENT") {
    throw new Error("INVALID_APPOINTMENT_STATUS_TRANSITION");
  }
  return transitionAppointmentStatus({
    ...input,
    expectedStatus,
    nextStatus: "CANCELLED",
  });
}

export async function startAppointmentService(appointmentId: string) {
  return transitionAppointmentStatusForStaff({
    appointmentId,
    expectedStatus: "CONFIRMED",
    nextStatus: "IN_PROGRESS",
  });
}

export async function completeAppointmentService(appointmentId: string) {
  return transitionAppointmentStatusForStaff({
    appointmentId,
    expectedStatus: "IN_PROGRESS",
    nextStatus: "COMPLETED",
  });
}

export async function markAppointmentNoShowService(appointmentId: string) {
  return transitionAppointmentStatusForStaff({
    appointmentId,
    expectedStatus: "CONFIRMED",
    nextStatus: "NO_SHOW",
  });
}

async function transitionAppointmentStatusForStaff(args: {
  appointmentId: string;
  expectedStatus: AppointmentStatus;
  nextStatus: AppointmentStatus;
}) {
  const user = await requireAuthenticatedUser();
  if (user.role !== "ADMIN" && user.role !== "DOCTOR") throw new Error("FORBIDDEN");

  const appointment = await getAppointmentContext(args.appointmentId);
  const isAdmin = user.role === "ADMIN";
  const isAssignedDoctor = appointment.doctor.userId === user.id;
  if (!isAdmin && !isAssignedDoctor) throw new Error("FORBIDDEN");

  if (appointment.status !== args.expectedStatus) {
    throw new Error("INVALID_APPOINTMENT_STATUS_TRANSITION");
  }
  if (args.nextStatus === "NO_SHOW" && appointment.startAt > new Date()) {
    throw new Error("APPOINTMENT_NOT_STARTED_YET");
  }

  const result = await prisma.appointment.updateMany({
    where: { id: args.appointmentId, status: args.expectedStatus },
    data: { status: args.nextStatus },
  });
  if (result.count === 0) throw new Error("APPOINTMENT_STATUS_CHANGED_CONCURRENTLY");

  return prisma.appointment.findUnique({
    where: { id: args.appointmentId },
    include: {
      patient: {
        select: {
          fullName: true,
          phone: true,
          managedBy: { select: { email: true } },
        },
      },
      doctor: { select: { name: true, imageUrl: true } },
      service: { select: { id: true, name: true, durationMinutes: true, price: true } },
      room: { select: { id: true, name: true, roomNumber: true } },
    },
  });
}

function getVietnamDayRange(dateStr: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error("INVALID_DATE_FORMAT");
  }

  const [year, month, day] = dateStr.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("INVALID_DATE");
  }

  // Việt Nam UTC+7
  const startOfDay = new Date(
    Date.UTC(year, month - 1, day) - 7 * 60 * 60 * 1000,
  );

  const endOfDay = new Date(
    Date.UTC(year, month - 1, day + 1) - 7 * 60 * 60 * 1000,
  );

  return { startOfDay, endOfDay };
}
