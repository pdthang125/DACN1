"use server";

import { prisma } from "../prisma";
import { AppointmentStatus } from "@prisma/client";

export async function getAdminStats() {
  try {
   const [
  totalDoctors,
  activeDoctors,
  totalAppointments,
  completedAppointments,
  weeklyAppointments,
  todayAppointments,
] = await Promise.all([
  prisma.doctor.count(),

  prisma.doctor.count({
    where: {
      isActive: true,
    },
  }),

  prisma.appointment.count(),

  prisma.appointment.count({
    where: {
      status: "COMPLETED",
    },
  }),

  prisma.appointment.count({
    where: {
      date: {
        gte: new Date(
          Date.now() -
            7 *
              24 *
              60 *
              60 *
              1000
        ),
      },
    },
  }),

  prisma.appointment.count({
    where: {
      date: {
        gte: new Date(
          new Date().setHours(
            0,
            0,
            0,
            0
          )
        ),
      },
    },
  }),
]);

    const completionRate =
      totalAppointments > 0
        ? Math.round(
            (completedAppointments /
              totalAppointments) *
              100
          )
        : 0;

    const activeDoctorRate =
      totalDoctors > 0
        ? Math.round(
            (activeDoctors /
              totalDoctors) *
              100
          )
        : 0;

    return {
      todayAppointments,
      totalDoctors,
      activeDoctors,
      totalAppointments,
      completedAppointments,
      weeklyAppointments,
      completionRate,
      activeDoctorRate,
    };
  } catch (error) {
    console.error(
      "Error fetching admin stats:",
      error
    );

    return {
      totalDoctors: 0,
      todayAppointments: 0,
      activeDoctors: 0,
      totalAppointments: 0,
      completedAppointments: 0,
      weeklyAppointments: 0,
      completionRate: 0,
      activeDoctorRate: 0,
    };
  }
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  try {
    await prisma.appointment.update({
      where: {
        id: appointmentId,
      },

      data: {
        status,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Error updating appointment:",
      error
    );

    return {
      success: false,
    };
  }
}