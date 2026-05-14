"use client";

import { useGetAppointments } from "@/hooks/use-appointment";
import { useGetDoctors } from "@/hooks/use-doctors";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

function StatisticsPage() {
  const { data: appointments = [] } = useGetAppointments();
  const { data: doctors = [] } = useGetDoctors();

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "COMPLETED"
    ).length;

  const completionRate =
    appointments.length > 0
      ? Math.round(
          (completedAppointments /
            appointments.length) *
            100
        )
      : 0;

  const topDoctor =
    doctors.sort(
      (a, b) =>
        b.appointmentCount - a.appointmentCount
    )[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900">
          Thống kê hệ thống
        </h1>

        <p className="text-slate-500 mt-2">
          Phân tích hoạt động phòng khám nha khoa
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="rounded-[2rem] border-slate-100 shadow-sm">
          <CardContent className="p-8">
            <div className="text-slate-500 text-sm">
              Tổng lịch hẹn
            </div>

            <div className="text-5xl font-black text-slate-900 mt-3">
              {appointments.length}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-100 shadow-sm">
          <CardContent className="p-8">
            <div className="text-slate-500 text-sm">
              Tỷ lệ hoàn thành
            </div>

            <div className="text-5xl font-black text-green-600 mt-3">
              {completionRate}%
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-100 shadow-sm">
          <CardContent className="p-8">
            <div className="text-slate-500 text-sm">
              Bác sĩ nổi bật
            </div>

            <div className="text-2xl font-black text-slate-900 mt-3">
              {topDoctor?.name || "N/A"}
            </div>

            <div className="text-slate-500 mt-2">
              {topDoctor?.appointmentCount || 0} lịch hẹn
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StatisticsPage;