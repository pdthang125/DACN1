import { getUserAppointments } from "@/lib/actions/appointments";
import { format, isAfter, isSameDay, parseISO } from "date-fns";
import NoNextAppointments from "./NoNextAppointments";
import { Card, CardContent } from "../ui/card";
import { CalendarIcon, ClockIcon, UserIcon, MapPinIcon, ShieldCheckIcon, ArrowRightIcon } from "lucide-react";

async function NextAppointment() {
  const appointments = await getUserAppointments();

  const upcomingAppointments =
    appointments?.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      const today = new Date();
      const isUpcoming = isSameDay(appointmentDate, today) || isAfter(appointmentDate, today);
      return isUpcoming && appointment.status === "CONFIRMED";
    }) || [];

  const nextAppointment = upcomingAppointments[0];

  if (!nextAppointment) return <NoNextAppointments />;

  const appointmentDate = parseISO(nextAppointment.date);
  const formattedDate = format(appointmentDate, "dd/MM/yyyy");
  const isToday = isSameDay(appointmentDate, new Date());

  return (
    <Card className="relative overflow-hidden border-slate-100 shadow-xl shadow-blue-900/5 rounded-[2.5rem] bg-white group hover:shadow-2xl transition-all duration-500">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
      
      <CardContent className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <CalendarIcon className="size-5 text-blue-600" />
             </div>
             <h3 className="font-black text-slate-900 tracking-tight">Lịch hẹn sắp tới</h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            isToday ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
          }`}>
             {isToday ? "Hôm nay" : "Sắp tới"}
          </div>
        </div>

        {/* Doctor Info Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
             <img src={nextAppointment.doctorImageUrl || "https://github.com/shadcn.png"} alt="Doctor" className="size-full object-cover" />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm leading-tight">{nextAppointment.doctorName}</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">{nextAppointment.reason}</p>
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="size-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
              <CalendarIcon className="size-4 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày khám</p>
              <p className="text-sm font-bold text-slate-900">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="size-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
              <ClockIcon className="size-4 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giờ khám</p>
              <p className="text-sm font-bold text-blue-600">{nextAppointment.time}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="size-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
              <MapPinIcon className="size-4 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Địa điểm</p>
              <p className="text-sm font-bold text-slate-900">Nha khoa SmileCare</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              <ShieldCheckIcon className="size-3" /> Đã xác nhận
           </div>
           <button className="text-blue-600 hover:text-blue-700 text-xs font-black flex items-center gap-1 group/btn">
              Xem chi tiết <ArrowRightIcon className="size-3 group-hover/btn:translate-x-1 transition-transform" />
           </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default NextAppointment;
