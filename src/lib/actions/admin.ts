"use server";

import { prisma } from "../prisma";

export async function getAdminStats() {
  try {
    const [
      totalDoctors,
      activeDoctors,
      totalAppointments,
      completedAppointments,
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
    ]);

    return {
      totalDoctors,
      activeDoctors,
      totalAppointments,
      completedAppointments,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);

    return {
      totalDoctors: 0,
      activeDoctors: 0,
      totalAppointments: 0,
      completedAppointments: 0,
    };
  }
}