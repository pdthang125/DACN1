export function generateAiInsights(
  appointments: any[]
) {

  const insights: string[] = [];

  // TOTAL

  const totalAppointments =
    appointments.length;

  // COMPLETED

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "COMPLETED"
    ).length;

  // CANCELLED

  const cancelledAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "CANCELLED"
    ).length;

  // CANCEL RATE

  const cancelRate =
    totalAppointments > 0
      ? (
          cancelledAppointments /
          totalAppointments
        ) * 100
      : 0;

  // MORNING APPOINTMENTS

  const morningAppointments =
    appointments.filter(
      (appointment) => {

        const hour =
          parseInt(
            appointment.time.split(":")[0]
          );

        return hour >= 8 && hour <= 11;

      }
    ).length;

  // AI RULES

  if (cancelRate > 20) {

    insights.push(
      "Tỷ lệ hủy lịch đang cao, nên xác nhận lịch trước với bệnh nhân."
    );

  }

  if (
    morningAppointments >
    totalAppointments * 0.5
  ) {

    insights.push(
      "Buổi sáng đang quá tải lịch hẹn, nên tăng bác sĩ trực."
    );

  }

  if (
    completedAppointments >
    totalAppointments * 0.7
  ) {

    insights.push(
      "Tỷ lệ hoàn thành lịch hẹn rất tốt."
    );

  }

  if (totalAppointments < 5) {

    insights.push(
      "Lượng lịch hẹn còn thấp, nên tăng quảng bá phòng khám."
    );

  }

  // DEFAULT

  if (insights.length === 0) {

    insights.push(
      "Hệ thống đang hoạt động ổn định."
    );

  }

  return insights;

}