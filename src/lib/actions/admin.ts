"use server";

import { prisma } from "../prisma";
import { AppointmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
  try {
    const now = new Date();

    // 1. Mốc 7 ngày gần nhất
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 2. Mốc đầu ngày và cuối ngày hôm nay (00:00:00 -> 23:59:59.999)
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const [
      totalDoctors,
      activeDoctors,
      totalAppointments,
      completedAppointments,
      weeklyAppointments,
      todayAppointments,
    ] = await Promise.all([
      // Tổng số bác sĩ
      prisma.doctor.count(),

      // Bác sĩ đang hoạt động
      prisma.doctor.count({
        where: { isActive: true },
      }),

      // Tổng số lịch hẹn
      prisma.appointment.count(),

      // Lịch hẹn đã hoàn tất
      prisma.appointment.count({
        where: { status: AppointmentStatus.COMPLETED },
      }),

      // Lịch hẹn trong 7 ngày qua (dùng startAt thay cho date)
      prisma.appointment.count({
        where: {
          startAt: {
            gte: sevenDaysAgo,
          },
        },
      }),

      // Lịch hẹn trong ngày hôm nay (chặn chuẩn 2 đầu)
      prisma.appointment.count({
        where: {
          startAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      }),
    ]);

    // Tính tỷ lệ %
    const completionRate =
      totalAppointments > 0
        ? Math.round((completedAppointments / totalAppointments) * 100)
        : 0;

    const activeDoctorRate =
      totalDoctors > 0
        ? Math.round((activeDoctors / totalDoctors) * 100)
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
    console.error("Error fetching admin stats:", error);

    return {
      todayAppointments: 0,
      totalDoctors: 0,
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
        // Tự động ghi nhận thời gian hủy nếu admin chuyển sang CANCELLED
        ...(status === AppointmentStatus.CANCELLED && {
          cancelledAt: new Date(),
          cancelledByRole: "ADMIN",
        }),
      },
    });

    // Làm mới cache giao diện dashboard admin ngay lập tức
    revalidatePath("/dashboard/admin");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating appointment:", error);

    return {
      success: false,
    };
  }
}