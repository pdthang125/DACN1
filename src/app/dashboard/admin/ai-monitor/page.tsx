"use client";
import { generateAiInsights } from "@/lib/ai-analysis";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
  Brain,
  TrendingUp,
  CalendarDays,
  Clock3,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

import { useGetAppointments } from "@/hooks/use-appointment";

import {
  Card,
  CardContent,
} from "@/components/ui/card";


function AiMonitorPage() {

  const {
    data: appointments = [],
  } = useGetAppointments();





  const hourMap: {
    [key: string]: number;
  } = {};

  appointments.forEach(
    (appointment) => {

      const time =
        appointment.time;

      if (time) {

        const hour =
          time.slice(0, 5);

        hourMap[hour] =
          (hourMap[hour] || 0) + 1;

      }

    }
  );

  const hourlyData =
    Object.entries(hourMap)

      .map(
        ([time, count]) => ({
          time,
          count,
        })
      )
      .sort((a, b) =>
        a.time.localeCompare(
          b.time
        )
      );

  const currentMonth =
    new Date().getMonth() + 1;

  // TOTAL APPOINTMENTS 😎🔥

  const currentAppointments =
    appointments.length;

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "COMPLETED"
    ).length;

  const cancelledAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "CANCELLED"
    ).length;

  const cancellationRate =
    appointments.length > 0
      ? Math.round(
        (cancelledAppointments /
          appointments.length) *
        100
      )
      : 0;



  // COMPLETED 😎🔥



  // CANCELLED 😎🔥



  // AI ANALYTICS 😎🔥

  const completionRate =
    currentAppointments > 0
      ? completedAppointments /
      currentAppointments
      : 0;

  const cancelRate =
    currentAppointments > 0
      ? cancelledAppointments /
      currentAppointments
      : 0;

  // AI GROWTH SCORE 😎🔥

  const growthFactor =
    completionRate * 3 -
    cancelRate * 2;

  // AI FORECAST DATA 😎🔥

  const predictionData = Array.from(
    { length: 12 },
    (_, index) => {

      const month = index + 1;

      // PAST MONTHS 😎🔥

      if (month < currentMonth) {

        return {
          month: `T${month}`,
          appointments: 0,
        };

      }

      // CURRENT MONTH 😎🔥

      if (month === currentMonth) {

        return {
          month: `T${month}`,
          appointments:
            currentAppointments,
        };

      }

      // FUTURE PREDICTION 😎🔥

      const predictedValue =
        Math.max(
          0,
          Math.round(
            currentAppointments +
            (month -
              currentMonth) *
            growthFactor
          )
        );

      return {
        month: `T${month}`,
        appointments:
          predictedValue,
      };

    }
  );

  const appointmentTrend =
    Math.round(
      growthFactor * 10
    );

  const aiInsights =
    generateAiInsights(
      appointments
    );




  const busiestHours =
    Object.entries(hourMap)
      .map(
        ([hour, total]) => ({
          hour,
          total,
        })
      )
      .sort((a, b) =>
        a.hour.localeCompare(
          b.hour
        )
      );
  const peakHour =
    busiestHours.length > 0
      ? busiestHours.reduce(
        (max, current) =>
          current.total > max.total
            ? current
            : max
      )
      : null;

  const statusData = [
    {
      name: "Hoàn thành",
      value: completedAppointments,
      color: "#22c55e",
    },
    {
      name: "Đã hủy",
      value: cancelledAppointments,
      color: "#ef4444",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#7c3aed] p-10 text-white shadow-xl shadow-blue-200">

        <div className="flex items-center gap-5">

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">

            <Brain className="size-8 text-white" />

          </div>

          <div>

            <h1 className="text-5xl font-black">
              AI Phân tích hệ thống
            </h1>

            <p className="mt-3 text-lg text-blue-100">
              Phân tích hoạt động phòng khám bằng AI
            </p>

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">

        <Card className="rounded-3xl border border-blue-100 bg-blue-50 shadow-sm">

          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-blue-600">
                  Lịch hoàn thành
                </p>

                <h3 className="mt-3 text-4xl font-black text-blue-700">
                  {completedAppointments}
                </h3>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">

                <CalendarDays className="size-7 text-blue-700" />

              </div>

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-3xl border border-red-100 bg-red-50 shadow-sm">

          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-red-600">
                  Tỷ lệ hủy lịch
                </p>

                <h3 className="mt-3 text-4xl font-black text-red-700">
                  {cancellationRate}%
                </h3>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">

                <AlertTriangle className="size-7 text-red-700" />

              </div>

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-3xl border border-violet-100 bg-violet-50 shadow-sm">

          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-violet-600">
                  Khung giờ đông
                </p>

                <h3 className="mt-3 text-3xl font-black text-violet-700">
                  {peakHour
                    ? `${peakHour.hour}`
                    : "Chưa có dữ liệu"}
                </h3>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">

                <Clock3 className="size-7 text-violet-700" />

              </div>

            </div>

          </CardContent>

        </Card>

        <Card className="rounded-3xl border border-emerald-100 bg-emerald-50 shadow-sm">

          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-emerald-600">
                  Xu hướng lịch hẹn
                </p>

                <h3 className="mt-3 text-3xl font-black text-emerald-700">
                  {appointmentTrend >= 0 ? "+" : ""}
                  {appointmentTrend}%
                </h3>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">

                <TrendingUp className="size-7 text-emerald-700" />

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* AI PREDICTION */}

        <Card className="rounded-[2rem] border border-slate-200 shadow-sm">

          <CardContent className="p-8">

            <div className="mb-6">

              <h2 className="text-2xl font-black text-slate-900">
                AI dự đoán lịch hẹn
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Dự đoán lượng lịch hẹn các tháng tới
              </p>

            </div>

            <div className="h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart data={predictionData}>

                  <defs>

                    <linearGradient
                      id="colorAppointments"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="5%"
                        stopColor="#4f46e5"
                        stopOpacity={0.8}
                      />

                      <stop
                        offset="95%"
                        stopColor="#4f46e5"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.2}
                  />

                  <XAxis dataKey="month" />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${value} lịch hẹn`,
                      "Dự đoán",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="appointments"
                    stroke="#4f46e5"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorAppointments)"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </CardContent>

        </Card>

        {/* PIE */}

        <Card className="rounded-[2rem] border border-slate-200 shadow-sm">

          <CardContent className="p-8">

            <div className="mb-6">

              <h2 className="text-2xl font-black text-slate-900">
                AI phân tích trạng thái
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
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >

                    {statusData.map(
                      (entry, index) => (

                        <Cell
                          key={index}
                          fill={entry.color}
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

      {/* BUSIEST HOURS */}

      <Card className="rounded-[2rem] border border-slate-200 shadow-sm">

        <CardContent className="p-8">

          <div className="mb-6">

            <h2 className="text-2xl font-black text-slate-900">
              Phân tích khung giờ
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              AI phân tích thời gian đông bệnh nhân
            </p>

          </div>

          <div className="h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={busiestHours}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                />

                <XAxis dataKey="hour" />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value} lịch hẹn`,
                    "Số lượng",
                  ]}
                />

                <Bar
                  dataKey="total"
                  fill="#2563eb"
                  radius={[10, 10, 0, 0]}
                  barSize={60}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </CardContent>

      </Card>

      {/* AI INSIGHT */}

      <Card className="rounded-[2rem] border border-violet-100 bg-violet-50 shadow-sm">

        <CardContent className="p-8">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">

              <Sparkles className="size-6 text-violet-700" />

            </div>

            <div>

              <h2 className="text-2xl font-black text-slate-900">
                AI Insight
              </h2>

              <p className="text-sm text-slate-500">
                Gợi ý và phân tích thông minh
              </p>

            </div>

          </div>

          <div className="space-y-4">

            {aiInsights.map(
              (insight, index) => (

                <div
                  key={index}
                  className="rounded-2xl bg-white p-5"
                >

                  <p className="font-semibold text-slate-700">

                    • {insight}

                  </p>

                </div>

              )
            )}

          </div>

        </CardContent>

      </Card>

    </div>
  );
}

export default AiMonitorPage;