"use client";
import { useGetAppointments } from "@/hooks/use-appointment";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";



function AppointmentsChart() {
    const { data: appointments = [] } =
    useGetAppointments();

const last7Days = [...Array(7)].map(
  (_, index) => {
    const date = new Date();

    date.setDate(
      date.getDate() - (6 - index)
    );

    return date;
  }
);

const chartData = last7Days.map(
  (date) => {
    const formattedDay =
      date.toLocaleDateString("vi-VN", {
        weekday: "short",
      });

    const totalAppointments =
      appointments.filter(
        (appointment) => {
          const appointmentDate =
            new Date(
              appointment.date
            );

          return (
            appointmentDate.toDateString() ===
            date.toDateString()
          );
        }
      ).length;

    return {
      day: formattedDay,
      appointments:
        totalAppointments,
    };
  }
);
  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-white p-8 shadow-sm">

      {/* Header */}
      <div className="mb-10 flex items-start justify-between">

        <div>

          <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            PHÂN TÍCH HỆ THỐNG
          </div>

          <h2 className="mt-4 text-3xl font-black text-slate-900">
            Thống kê lịch hẹn
          </h2>

          <p className="mt-2 text-slate-500">
            Số lượng lịch khám trong 7 ngày gần nhất
          </p>

        </div>

        <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
          +18% tuần này
        </div>
      </div>

      {/* Chart */}
      <div className="h-[360px]">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={chartData}>

            {/* Gradient */}
            <defs>
              <linearGradient
                id="colorAppointments"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#2563eb"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />

            {/* X Axis */}
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 14,
                fontWeight: 600,
              }}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                boxShadow:
                  "0 10px 40px rgba(0,0,0,0.08)",
                padding: "12px 16px",
              }}
              formatter={(value) => [
                `${value} lịch hẹn`,
                "Tổng",
              ]}
              labelFormatter={(label) =>
                `Ngày ${label}`
              }
            />

            {/* Area */}
            <Area
              type="monotone"
              dataKey="appointments"
              stroke="none"
              fill="url(#colorAppointments)"
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="appointments"
              stroke="#2563eb"
              strokeWidth={4}
              dot={{
                r: 6,
                fill: "#fff",
                strokeWidth: 4,
                stroke: "#2563eb",
              }}
              activeDot={{
                r: 8,
                fill: "#2563eb",
                stroke: "#fff",
                strokeWidth: 3,
              }}
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AppointmentsChart;