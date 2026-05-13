import { useAvailableDoctors } from "@/hooks/use-doctors";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { MapPinIcon, PhoneIcon, StarIcon, ShieldCheckIcon, ArrowRightIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DoctorCardsLoading } from "./DoctorCardsLoading";

interface DoctorSelectionStepProps {
  selectedDentistId: string | null;
  onSelectDentist: (dentistId: string) => void;
  onContinue: () => void;
}

function DoctorSelectionStep({
  onContinue,
  onSelectDentist,
  selectedDentistId,
}: DoctorSelectionStepProps) {
  const { data: dentists = [], isLoading } = useAvailableDoctors();

  if (isLoading)
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Đang tải danh sách bác sĩ...</h2>
        </div>
        <DoctorCardsLoading />
      </div>
    );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Chọn Bác sĩ Nha khoa</h2>
        </div>
        <p className="text-sm text-slate-500 font-medium">Tìm thấy {dentists.length} chuyên gia sẵn sàng hỗ trợ</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dentists.map((dentist) => (
          <div
            key={dentist.id}
            onClick={() => onSelectDentist(dentist.id)}
            className={`group relative cursor-pointer rounded-[2rem] transition-all duration-300 ${
              selectedDentistId === dentist.id
                ? "ring-4 ring-blue-500 ring-offset-4 scale-[1.02]"
                : "hover:scale-[1.02]"
            }`}
          >
            <Card className={`h-full border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-shadow ${
              selectedDentistId === dentist.id ? "bg-blue-50/50 border-blue-200" : "bg-white"
            }`}>
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={dentist.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=1000&auto=format&fit=crop"}
                  alt={dentist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full">
                  <StarIcon className="size-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-black text-white">4.9</span>
                  <span className="text-[10px] text-white/80 font-medium">({dentist.appointmentCount}+ khám)</span>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">{dentist.name}</h3>
                  <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">
                    {dentist.speciality || "Nha khoa Tổng quát"}
                  </p>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2">
                  {dentist.bio || "Bác sĩ giàu kinh nghiệm, tận tâm chăm sóc nụ cười khỏe mạnh cho mọi bệnh nhân."}
                </p>

                <div className="space-y-2.5 pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPinIcon className="size-3.5 text-blue-400" />
                    <span className="text-xs font-medium">Hệ thống SmileCare</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <PhoneIcon className="size-3.5 text-blue-400" />
                    <span className="text-xs font-medium">{dentist.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <ShieldCheckIcon className="size-3" /> Đã cấp chứng chỉ
                  </div>
                  {selectedDentistId === dentist.id && (
                    <div className="size-6 bg-blue-600 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                      <ArrowRightIcon className="size-3.5 text-white" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {selectedDentistId && (
        <div className="flex justify-end pt-8">
          <Button 
            onClick={onContinue} 
            className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 group"
          >
            Tiếp tục chọn thời gian
            <ArrowRightIcon className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default DoctorSelectionStep;
