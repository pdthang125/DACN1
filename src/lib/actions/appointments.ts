
"use server";

import {
  getAppointmentsService,
  getUserAppointmentsService,
  getBookedTimeSlotsService,
  getDoctorAvailableTimeSlotsService,
  bookAppointmentService,
  cancelAppointmentService,
  startAppointmentService,
  completeAppointmentService,
  markAppointmentNoShowService,
  getUserAppointmentStatsService,
} from "@/lib/services/appointments.service";

import type {
  BookAppointmentRequest,
  AvailableTimeSlot,
} from "@/lib/services/appointments.service";

export async function getAppointments() {
  return getAppointmentsService();
}

export async function getUserAppointments() {
  return getUserAppointmentsService();
}

export async function getUserAppointmentStats() {
  return getUserAppointmentStatsService();
}

export async function getDoctorAvailableSlots(
  doctorId: string,
  date: string,
  serviceId?: string,
): Promise<AvailableTimeSlot[]> {
  return getDoctorAvailableTimeSlotsService(doctorId, date, serviceId);
}

export async function getBookedTimeSlots(
  doctorId: string,
  date: string,
  serviceId?: string,
) {
  return getBookedTimeSlotsService(doctorId, date, serviceId);
}

export async function bookAppointment(input: BookAppointmentRequest) {
  try {
    const appointment = await bookAppointmentService(input);
    return { ok: true, appointment } as const;
  } catch (error) {
    if (error instanceof Error && error.message === "SERVICE_NOT_AVAILABLE") {
      return { ok: false, code: "SERVICE_NOT_AVAILABLE" } as const;
    }
    throw error;
  }
}

export async function cancelAppointment(input: {
  appointmentId: string;
  cancellationReason?: string;
  expectedStatus?: "CONFIRMED" | "PENDING_PAYMENT";
}) {
  return cancelAppointmentService(input);
}

export async function startAppointment(appointmentId: string) {
  return startAppointmentService(appointmentId);
}

export async function completeAppointment(appointmentId: string) {
  return completeAppointmentService(appointmentId);
}

export async function markAppointmentNoShow(appointmentId: string) {
  return markAppointmentNoShowService(appointmentId);
}
