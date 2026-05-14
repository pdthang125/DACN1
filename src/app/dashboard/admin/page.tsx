"use client";
import AdminStats from "@/components/admin/AdminStats";
import DoctorsManagement from "@/components/admin/DoctorsManagement";
import RecentAppointments from "@/components/admin/RecentAppointments";
import AppointmentsChart from "@/components/admin/AppointmentsChart";
import SystemStatus from "@/components/admin/SystemStatus";
import { useAdminStats } from "@/hooks/use-admin";

export default function AdminDashboardPage() {
  const { data: stats } = useAdminStats();
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm p-10">
        {/* Background blur */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40" />

        <div className="relative z-10 flex items-center justify-between gap-8">
          {/* Left content */}
          <div>
            <p className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs">
              HỆ THỐNG NHA KHOA THÔNG MINH
            </p>

            <h1 className="text-5xl font-black text-slate-900 mt-4 leading-tight">
              Bảng điều khiển quản trị
            </h1>

            <p className="text-slate-500 mt-5 text-lg max-w-2xl leading-relaxed">
              Nền tảng quản lý phòng khám nha khoa tích hợp trí tuệ nhân tạo hỗ trợ đặt lịch,
              quản lý bác sĩ và theo dõi tình trạng khách hàng theo thời gian thực.
            </p>

            {/* Status badges */}
            <div className="flex flex-wrap items-center gap-3 mt-7">
              <div className="flex items-center gap-4 mt-8">
  <button className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all">
    + Thêm lịch hẹn
  </button>

  <button className="h-12 px-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 text-slate-700 font-bold transition-all">
    + Thêm bác sĩ
  </button>
</div>
              <div className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-700 text-sm font-bold shadow-sm">
                AI Assistant Online
              </div>

              <div className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 text-sm font-bold shadow-sm">
                Hệ thống hoạt động ổn định
              </div>

              <div className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold shadow-sm">
                Cập nhật realtime
              </div>
            </div>
          </div>

          {/* Right icon */}
          <div className="hidden lg:flex">
            <div className="relative w-36 h-36 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-2xl shadow-blue-200 overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />

              <div className="relative z-10 text-6xl">
                🦷
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <AdminStats
  totalDoctors={stats?.totalDoctors || 0}
  activeDoctors={stats?.activeDoctors || 0}
  totalAppointments={stats?.totalAppointments || 0}
  completedAppointments={stats?.completedAppointments || 0}
/>

      <div className="grid lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">
    <AppointmentsChart />
  </div>

  <SystemStatus />
</div>

      {/* Appointments */}
      <RecentAppointments />

      {/* Doctors */}
      <DoctorsManagement />
    </div>
  );
}