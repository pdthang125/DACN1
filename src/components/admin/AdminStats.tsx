"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, UserCheck, Clock } from "lucide-react";

interface AdminStatsProps {
  totalDoctors: number;
  activeDoctors: number;
  totalAppointments: number;
  completedAppointments: number;
}

function AdminStats({
  activeDoctors,
  totalDoctors,
  completedAppointments,
  totalAppointments,
}: AdminStatsProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12">
      <Card className="border-0 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <CardContent className="p-7">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Users className="size-6" />
            </div>
            <div>
              <div className="text-4xl font-black text-slate-900">{totalDoctors}</div>
              <div className="text-sm text-slate-500 font-semibold mt-1">Tổng bác sĩ</div>
              <div className="text-xs text-slate-500 mt-1">
  +2 bác sĩ mới tháng này
</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <CardContent className="p-7">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <UserCheck className="size-6" />
            </div>
            <div>
              <div className="text-4xl font-black text-slate-900">{activeDoctors}</div>
              <div className="text-sm text-slate-500 font-semibold mt-1">Bác sĩ đang hoạt động</div>
              <div className="text-xs text-slate-500 mt-1">
  83% đang online
</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <CardContent className="p-7">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Calendar className="size-6" />
            </div>
            <div>
              <div className="text-4xl font-black text-slate-900">{totalAppointments}</div>
              <div className="text-sm text-slate-500 font-semibold mt-1">Tổng lịch hẹn</div>
              <div className="text-xs text-slate-500 mt-1">
  +12 lịch hôm nay
</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <CardContent className="p-7">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Clock className="size-6" />
            </div>
            <div>
              <div className="text-4xl font-black text-slate-900">{completedAppointments}</div>
              <div className="text-sm text-slate-500 font-semibold mt-1">Lịch đã hoàn thành</div>
              <div className="text-xs text-slate-500 mt-1">
  Tỷ lệ hoàn thành 92%
</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default AdminStats;
