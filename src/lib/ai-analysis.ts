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

  const hourMap: Record<string, number> = {};

  appointments.forEach((appointment) => {
    if (appointment.time) {
      hourMap[appointment.time] =
        (hourMap[appointment.time] || 0) + 1;
    }
  });

  const peakHour = Object.entries(hourMap)
    .sort((a, b) => b[1] - a[1])[0];

  if (peakHour) {
    insights.push(
      `Khung giờ đông nhất hiện tại là ${peakHour[0]} với ${peakHour[1]} lịch hẹn.`
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