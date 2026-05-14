"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "T2", appointments: 12 },
  { day: "T3", appointments: 19 },
  { day: "T4", appointments: 15 },
  { day: "T5", appointments: 24 },
  { day: "T6", appointments: 20 },
  { day: "T7", appointments: 28 },
  { day: "CN", appointments: 16 },
];

function AppointmentsChart() {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Thống kê lịch hẹn
          </h2>

          <p className="text-slate-500 mt-1">
            Số lượng lịch khám trong 7 ngày gần nhất
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-700 text-sm font-bold">
          +18% tuần này
        </div>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="appointments"
              stroke="#2563eb"
              strokeWidth={4}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AppointmentsChart;