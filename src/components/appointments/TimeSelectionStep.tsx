import { useBookedTimeSlots } from "@/hooks/use-appointment";
import { APPOINTMENT_TYPES, getAvailableTimeSlots, getNext5Days } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ClockIcon, CalendarDaysIcon, SparklesIcon, ArrowRightIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface TimeSelectionStepProps {
  selectedDentistId: string;
  selectedDate: string;
  selectedTime: string;
  selectedType: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onTypeChange: (type: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

function TimeSelectionStep({
  onBack,
  onContinue,
  onDateChange,
  onTimeChange,
  onTypeChange,
  selectedDate,
  selectedDentistId,
  selectedTime,
  selectedType,
}: TimeSelectionStepProps) {
  const { data: bookedTimeSlots = [] } = useBookedTimeSlots(selectedDentistId, selectedDate);

  const availableDates = getNext5Days();
  const availableTimeSlots = getAvailableTimeSlots();

  const handleDateSelect = (date: string) => {
    onDateChange(date);
    onTimeChange("");
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="size-10 rounded-xl p-0 hover:bg-slate-100 transition-colors"
        >
          <ChevronLeftIcon className="size-5 text-slate-600" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Chọn Dịch vụ & Thời gian</h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Service selection */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <SparklesIcon className="size-4 text-blue-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">Loại dịch vụ</h3>
          </div>
          <div className="space-y-4">
            {APPOINTMENT_TYPES.map((type) => {
              const isSelected = selectedType === type.id;
              return (
                <div
                  key={type.id}
                  onClick={() => onTypeChange(type.id)}
                  className={`group relative cursor-pointer rounded-2xl transition-all duration-300 ${
                    isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"
                  }`}
                >
                  <Card className={`overflow-hidden border-slate-100 transition-all ${
                    isSelected ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200" : "bg-white hover:bg-slate-50"
                  }`}>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h4 className={`font-black text-base ${isSelected ? "text-white" : "text-slate-900"}`}>{type.name}</h4>
                          <div className="flex items-center gap-2">
                            <ClockIcon className={`size-3 ${isSelected ? "text-blue-100" : "text-slate-400"}`} />
                            <p className={`text-xs font-medium ${isSelected ? "text-blue-100" : "text-slate-500"}`}>{type.duration}</p>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-sm font-black ${
                          isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                        }`}>
                          {type.price}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Date & time selection */}
        <div className="space-y-8">
          {/* Date selection */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <CalendarDaysIcon className="size-4 text-blue-500" />
              <h3 className="text-sm font-black uppercase tracking-widest">Chọn Ngày khám</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableDates.map((date) => {
                const isSelected = selectedDate === date;
                const dateObj = new Date(date);
                return (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                      isSelected
                        ? "bg-blue-50 border-blue-600 shadow-lg shadow-blue-100"
                        : "bg-white border-slate-100 hover:border-blue-200"
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSelected ? "text-blue-600" : "text-slate-400"}`}>
                      {dateObj.toLocaleDateString("vi-VN", { weekday: "short" })}
                    </span>
                    <span className={`text-lg font-black ${isSelected ? "text-blue-700" : "text-slate-900"}`}>
                      {dateObj.getDate()}
                    </span>
                    <span className={`text-[10px] font-bold ${isSelected ? "text-blue-400" : "text-slate-400"}`}>
                      Tháng {dateObj.getMonth() + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time selection */}
          {selectedDate && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <ClockIcon className="size-4 text-blue-500" />
                <h3 className="text-sm font-black uppercase tracking-widest">Giờ trống</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {availableTimeSlots.map((time) => {
                  const isBooked = bookedTimeSlots.includes(time);
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      disabled={isBooked}
                      onClick={() => !isBooked && onTimeChange(time)}
                      className={`flex items-center justify-center h-11 rounded-xl text-xs font-black transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : isBooked
                          ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
                          : "bg-white text-slate-600 border border-slate-100 hover:border-blue-200 hover:text-blue-600"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
              {bookedTimeSlots.length > 5 && (
                <p className="text-[10px] text-slate-400 italic">* Lưu ý: Nhiều khung giờ đã có người đặt trước</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Continue button */}
      {selectedType && selectedDate && selectedTime && (
        <div className="flex justify-end pt-4">
          <Button 
            onClick={onContinue}
            className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 group"
          >
            Xem lại Lịch đặt
            <ArrowRightIcon className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default TimeSelectionStep;
