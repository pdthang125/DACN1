"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import {
  CalendarDays,
  CheckCircle2,
  Users,
  TrendingUp,
} from "lucide-react";

import { useGetAppointments } from "@/hooks/use-appointment";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

function StatisticsPage() {

  const {
    data: appointments = [],
  } = useGetAppointments();

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "COMPLETED"
    ).length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "CONFIRMED"
    ).length;

  const cancelledAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "CANCELLED"
    ).length;

  const completionRate =
    appointments.length > 0
      ? Math.round(
        (completedAppointments /
          appointments.length) *
        100
      )
      : 0;

  const monthMap = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ];

  const appointmentChartData =
    monthMap.map((month, index) => {

      const total =
        appointments.filter(
          (appointment) => {

            const appointmentMonth =
              new Date(
                appointment.date
              ).getMonth();

            return (
              appointmentMonth ===
              index
            );

          }
        ).length;

      return {
        month,
        appointments: total,
      };

    });

  const statusChartData = [
    {
      name: "Hoàn thành",
      value: completedAppointments,
      color: "#22c55e",
    },
    {
      name: "Đã xác nhận",
      value: confirmedAppointments,
      color: "#2563eb",
    },
    {
      name: "Đã hủy",
      value: cancelledAppointments,
      color: "#ef4444",
    },
  ];

  const doctorStats = appointments.reduce(
    (acc: any, appointment: any) => {

      const existingDoctor =
        acc.find(
          (doctor: any) =>
            doctor.name ===
            appointment.doctorName
        );

      if (existingDoctor) {

        existingDoctor.total += 1;

      } else {

        acc.push({
          name: appointment.doctorName,
          total: 1,
        });

      }

      return acc;

    },
    []
  );

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#7c3aed] p-10 text-white shadow-xl shadow-blue-200">

        <div className="flex items-center gap-5">

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">

            <TrendingUp className="size-8 text-white" />

          </div>

          <div>

            <h1 className="text-5xl font-black">
              Thống kê hệ thống
            </h1>

            <p className="mt-3 text-lg text-blue-100">
              Phân tích hoạt động
              phòng khám nha khoa
            </p>

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">

        <Card className="rounded-3xl border border-slate-200 shadow-sm">

          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-slate-400">
                  Tổng lịch hẹn
                </p>

                <h3 className="mt-3 text-4xl font-black text-slate-900">
                  {appointments.length}
                </h3>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">

                <CalendarDays className="size-7 text-blue-700" />

              </div>

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-3xl border border-emerald-100 bg-emerald-50 shadow-sm">

          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-emerald-600">
                  Tỷ lệ hoàn thành
                </p>

                <h3 className="mt-3 text-4xl font-black text-emerald-700">
                  {completionRate}%
                </h3>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">

                <CheckCircle2 className="size-7 text-emerald-700" />

              </div>

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-3xl border border-violet-100 bg-violet-50 shadow-sm">

          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-violet-600">
                  Bệnh nhân
                </p>

                <h3 className="mt-3 text-4xl font-black text-violet-700">

                  {
                    new Set(
                      appointments.map(
                        (appointment) =>
                          appointment.patientEmail
                      )
                    ).size
                  }

                </h3>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">

                <Users className="size-7 text-violet-700" />

              </div>

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-3xl border border-orange-100 bg-orange-50 shadow-sm">

          <CardContent className="p-6">

            <div>

              <p className="text-sm font-semibold text-orange-600">
                Bác sĩ nổi bật
              </p>

              <h3 className="mt-3 text-2xl font-black text-orange-700">

                {doctorStats.length > 0
                  ? doctorStats.sort(
                    (
                      a: any,
                      b: any
                    ) =>
                      b.total - a.total
                  )[0]?.name
                  : "N/A"}

              </h3>

              <p className="mt-2 text-sm text-orange-500">

                {doctorStats.length > 0
                  ? doctorStats.sort(
                    (
                      a: any,
                      b: any
                    ) =>
                      b.total - a.total
                  )[0]?.total
                  : 0}{" "}
                lịch hẹn

              </p>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* LINE CHART */}

        <Card className="rounded-[2rem] border border-slate-200 shadow-sm">

          <CardContent className="p-8">

            <div className="mb-6">

              <h2 className="text-2xl font-black text-slate-900">
                Lịch hẹn theo tháng
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Theo dõi lượng lịch hẹn
              </p>

            </div>

            <div className="h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={
                    appointmentChartData
                  }
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.2}
                  />

                  <XAxis dataKey="month" />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, "dataMax + 1"]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="appointments"
                    stroke="#2563eb"
                    strokeWidth={4}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </CardContent>

        </Card>

        {/* PIE CHART */}

        <Card className="rounded-[2rem] border border-slate-200 shadow-sm">

          <CardContent className="p-8">

            <div className="mb-6">

              <h2 className="text-2xl font-black text-slate-900">
                Tỷ lệ trạng thái
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Phân bổ trạng thái lịch hẹn
              </p>

            </div>

            <div className="h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={
                      statusChartData
                    }
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >

                    {statusChartData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={index}
                          fill={
                            entry.color
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* DOCTOR CHART */}

      <Card className="rounded-[2rem] border border-slate-200 shadow-sm">

        <CardContent className="p-8">

          <div className="mb-6">

            <h2 className="text-2xl font-black text-slate-900">
              Top bác sĩ nhiều lịch hẹn
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Hiệu suất hoạt động bác sĩ
            </p>

          </div>

          <div className="h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={doctorStats}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="name" />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, "dataMax + 1"]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                />

                <Tooltip />

                <Bar
                  dataKey="total"
                  fill="#4f46e5"
                  radius={[10, 10, 0, 0]}
                  barSize={60}
                  label={{ position: "top" }}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}

export default StatisticsPage;