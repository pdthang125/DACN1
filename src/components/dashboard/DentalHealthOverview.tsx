import { getUserAppointmentStats } from "@/lib/actions/appointments";
import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent } from "../ui/card";
import { BrainIcon, MessageSquareIcon, CalendarIcon, ActivityIcon, TrendingUpIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "../ui/button";

async function DentalHealthOverview() {
  const appointmentStats = await getUserAppointmentStats();
  const user = await currentUser();

  const stats = [
    { label: "Đã khám", value: appointmentStats.completedAppointments, icon: ActivityIcon, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Tổng lịch hẹn", value: appointmentStats.totalAppointments, icon: CalendarIcon, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Thành viên từ", value: format(new Date(user?.createdAt!), "MM/yyyy"), icon: TrendingUpIcon, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <Card className="lg:col-span-2 border-slate-100 shadow-xl shadow-blue-900/5 rounded-[2.5rem] overflow-hidden">
      <CardContent className="p-8 md:p-10 space-y-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <BrainIcon className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Hồ sơ Sức khỏe</h3>
                <p className="text-xs text-slate-500 font-medium tracking-wide">Hành trình chăm sóc răng miệng</p>
              </div>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className={`${stat.bg} p-6 rounded-3xl border border-white shadow-sm flex flex-col items-center text-center space-y-2 group transition-transform hover:-translate-y-1`}>
              <stat.icon className={`size-5 ${stat.color} mb-1`} />
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="relative p-6 md:p-8 bg-slate-900 rounded-[2rem] overflow-hidden group">
          {/* Decoration */}
          <div className="absolute top-0 right-0 size-32 bg-blue-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="size-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
              <MessageSquareIcon className="size-6 text-blue-400" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-1">
              <h4 className="text-lg font-black text-white">Bạn cần trợ giúp ngay?</h4>
              <p className="text-sm text-slate-400 font-medium">
                Sử dụng AI để tư vấn triệu chứng hoặc đặt lịch khám chuyên khoa nhanh chóng.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/voice">
                <Button size="sm" className="h-10 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg">
                  Chat AI
                </Button>
              </Link>
              <Link href="/appointments">
                <Button size="sm" variant="outline" className="h-10 px-5 border-white/20 text-white hover:bg-white/5 font-bold rounded-xl">
                  Đặt lịch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DentalHealthOverview;
