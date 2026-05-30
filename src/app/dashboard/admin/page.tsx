"use client";

import AdminStats from "@/components/admin/AdminStats";
import DoctorsManagement from "@/components/admin/DoctorsManagement";
import RecentAppointments from "@/components/admin/RecentAppointments";
import AppointmentsChart from "@/components/admin/AppointmentsChart";
import SystemStatus from "@/components/admin/SystemStatus";
import { useState } from "react";

import AddDoctorDialog from "@/components/admin/AddDoctorDialog";

import { useAdminStats } from "@/hooks/use-admin";
import RecentDoctors from "@/components/admin/RecentDoctors";

export default function AdminDashboardPage() {
  const { data: stats } = useAdminStats();
  const [
    isAddDoctorOpen,
    setIsAddDoctorOpen,
  ] = useState(false);

  return (
    <div className="space-y-8">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-white p-10 shadow-sm">

        {/* Background */}
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-60" />

        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-100 blur-3xl opacity-40" />

        <div className="relative z-10 flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">

          {/* LEFT */}
          <div className="max-w-3xl">

            {/* Label */}
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Nền tảng quản trị AI SmileCare
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-5xl font-black leading-[1.1] tracking-tight text-slate-900 xl:text-6xl">
              Bảng điều khiển quản trị nha khoa
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              Theo dõi hoạt động phòng khám theo thời gian thực, quản lý lịch hẹn,
              bác sĩ, khách hàng và hệ thống AI hỗ trợ vận hành trên một nền tảng duy nhất.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">



              <button
                onClick={() =>
                  setIsAddDoctorOpen(true)
                }
                className="h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base font-bold text-white shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] hover:shadow-blue-300"
              >
                + Thêm bác sĩ
              </button>

            </div>

            {/* Status */}
            <div className="mt-8 flex flex-wrap gap-3">

              <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                ● Hệ thống hoạt động ổn định
              </div>

              <div className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                ● AI Assistant Online
              </div>

              <div className="rounded-2xl bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
                ● Đồng bộ dữ liệu realtime
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden xl:block">

            <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 p-10 shadow-2xl shadow-blue-200">

              <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />

              <div className="relative z-10">

                <div className="text-7xl">
                  🦷
                </div>

                <div className="mt-8 space-y-4">

                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xl">
                    <p className="text-sm text-blue-100">
                      Tổng lịch hẹn hôm nay
                    </p>

                    <h3 className="mt-2 text-4xl font-black text-white">
                      {stats?.todayAppointments || 0}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xl">
                    <p className="text-sm text-blue-100">
                      Tỷ lệ hoàn thành lịch hẹn
                    </p>

                    <h3 className="mt-2 text-4xl font-black text-white">
                      {stats?.completionRate || 0}%
                    </h3>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <AdminStats
        totalDoctors={stats?.totalDoctors || 0}
        activeDoctors={stats?.activeDoctors || 0}
        totalAppointments={stats?.totalAppointments || 0}
        completedAppointments={stats?.completedAppointments || 0}

        completionRate={stats?.completionRate || 0}
        activeDoctorRate={stats?.activeDoctorRate || 0}
        weeklyAppointments={stats?.weeklyAppointments || 0}
      />

      {/* CHART + STATUS */}
      <div className="grid gap-8 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <AppointmentsChart />
        </div>

        <SystemStatus />

      </div>

      {/* RECENT APPOINTMENTS */}
      <RecentAppointments />

      {/* DOCTORS */}
      <RecentDoctors />
      <AddDoctorDialog
        isOpen={isAddDoctorOpen}
        onClose={() =>
          setIsAddDoctorOpen(false)
        }
      />
    </div>
  );
}