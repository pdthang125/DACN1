"use client";

import { Card, CardContent } from "@/components/ui/card";

import {
  Users,
  Calendar,
  UserCheck,
  Clock,
  TrendingUp,
} from "lucide-react";

interface AdminStatsProps {
  totalDoctors: number;
  activeDoctors: number;
  totalAppointments: number;
  completedAppointments: number;

  completionRate: number;
  activeDoctorRate: number;
  weeklyAppointments: number;
}

function AdminStats({
  activeDoctors,
  totalDoctors,
  completedAppointments,
  totalAppointments,
  completionRate,
  activeDoctorRate,
  weeklyAppointments,
}: AdminStatsProps) {

  const stats = [
    {
      title: "Tổng bác sĩ",
      value: totalDoctors,
      change: `${activeDoctorRate}% đang hoạt động`,
      icon: Users,
      color:
        "from-blue-500/20 to-blue-100",
      iconColor: "text-blue-600",
      badge:
        "bg-blue-50 text-blue-700",
    },

    {
      title: "Bác sĩ hoạt động",
      value: activeDoctors,
      change: `${activeDoctors}/${totalDoctors} bác sĩ online`,
      icon: UserCheck,
      color:
        "from-emerald-500/20 to-emerald-100",
      iconColor: "text-emerald-600",
      badge:
        "bg-emerald-50 text-emerald-700",
    },

    {
      title: "Tổng lịch hẹn",
      value: totalAppointments,
      change: `${weeklyAppointments} lịch trong 7 ngày`,
      icon: Calendar,
      color:
        "from-violet-500/20 to-violet-100",
      iconColor: "text-violet-600",
      badge:
        "bg-violet-50 text-violet-700",
    },

    {
      title: "Lịch hoàn thành",
      value: completedAppointments,
      change: `Tỷ lệ hoàn thành ${completionRate}%`,
      icon: Clock,
      color:
        "from-amber-500/20 to-amber-100",
      iconColor: "text-amber-600",
      badge:
        "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <Card
            key={index}
            className="group overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >

            <CardContent className="relative p-7">

              {/* Glow */}
              <div className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${item.color} blur-3xl opacity-40`} />

              <div className="relative z-10">

                {/* Top */}
                <div className="flex items-start justify-between">

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}
                  >
                    <Icon
                      className={`size-7 ${item.iconColor}`}
                    />
                  </div>

                  <div
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${item.badge}`}
                  >
                    <TrendingUp className="size-3" />
                    Live
                  </div>
                </div>

                {/* Value */}
                <div className="mt-8">

                  <h3 className="text-5xl font-black tracking-tight text-slate-900">
                    {item.value}
                  </h3>

                  <p className="mt-3 text-base font-semibold text-slate-700">
                    {item.title}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.change}
                  </p>

                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default AdminStats;