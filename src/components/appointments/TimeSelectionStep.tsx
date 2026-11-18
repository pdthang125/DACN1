"use client";

import { useEffect } from "react";
import { useDoctorAvailableSlots } from "@/hooks/use-appointment";
import { getNext5Days } from "@/lib/utils";

import { Button } from "../ui/button";
import {
  ChevronLeftIcon,
  ClockIcon,
  CalendarDaysIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";

export interface ServiceOption {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

interface TimeSelectionStepProps {
  selectedDentistId: string;
  selectedDate: string;
  selectedTime: string;
  selectedServiceId: string;
  services: ServiceOption[];

  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onServiceChange: (serviceId: string) => void;

  onBack: () => void;
  onContinue: () => void;
}

function TimeSelectionStep({
  onBack,
  onContinue,
  onDateChange,
  onTimeChange,
  onServiceChange,
  selectedDate,
  selectedDentistId,
  selectedTime,
  selectedServiceId,
  services,
}: TimeSelectionStepProps) {
  const { data: doctorSlots = [], isLoading: isLoadingSlots } =
    useDoctorAvailableSlots(selectedDentistId, selectedDate, selectedServiceId);

  const availableDates = getNext5Days();

  // Tự động chọn ngày đầu tiên nếu chưa chọn để người dùng thấy ngay UI chọn giờ
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      onDateChange(availableDates[0]);
    }
  }, [selectedDate, availableDates, onDateChange]);

  // Tự động chọn dịch vụ đầu tiên nếu chưa chọn
  useEffect(() => {
    if (!selectedServiceId && services.length > 0) {
      onServiceChange(services[0].id);
    }
  }, [selectedServiceId, services, onServiceChange]);

  const handleDateSelect = (date: string) => {
    onDateChange(date);
    onTimeChange("");
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
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

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Chọn Dịch vụ & Thời gian
          </h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* LEFT: SERVICE SELECTION */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <SparklesIcon className="size-4 text-blue-500" />

              <h3 className="text-sm font-black uppercase tracking-widest">
                Loại dịch vụ
              </h3>
            </div>

            <div className="space-y-4">
              {services.map((s) => {
                const isSelected = selectedServiceId === s.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => onServiceChange(s.id)}
                    className={`group relative cursor-pointer rounded-2xl transition-all duration-300 ${
                      isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"
                    }`}
                  >
                    <Card
                      className={`overflow-hidden border-slate-100 transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <h4
                              className={`font-black text-base ${
                                isSelected ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {s.name}
                            </h4>

                            <div className="flex items-center gap-2">
                              <ClockIcon
                                className={`size-3 ${
                                  isSelected
                                    ? "text-blue-100"
                                    : "text-slate-400"
                                }`}
                              />

                              <p
                                className={`text-xs font-medium ${
                                  isSelected
                                    ? "text-blue-100"
                                    : "text-slate-500"
                                }`}
                              >
                                {typeof s.durationMinutes === "number"
                                  ? `${s.durationMinutes} phút`
                                  : s.durationMinutes}
                              </p>
                            </div>
                          </div>

                          <div
                            className={`px-4 py-2 rounded-xl text-sm font-black ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {typeof s.price === "number"
                              ? s.price === 0
                                ? "Miễn phí"
                                : `${s.price.toLocaleString("vi-VN")}đ`
                              : s.price}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: DATE & TIME SELECTION */}
        <div className="space-y-8">
          {/* DATE */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <CalendarDaysIcon className="size-4 text-blue-500" />

              <h3 className="text-sm font-black uppercase tracking-widest">
                Chọn Ngày khám
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableDates.map((date) => {
                const isSelected = selectedDate === date;
                const dateObj = new Date(date);

                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                      isSelected
                        ? "bg-blue-50 border-blue-600 shadow-lg shadow-blue-100"
                        : "bg-white border-slate-100 hover:border-blue-200"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                        isSelected ? "text-blue-600" : "text-slate-400"
                      }`}
                    >
                      {dateObj.toLocaleDateString("vi-VN", {
                        weekday: "short",
                      })}
                    </span>

                    <span
                      className={`text-lg font-black ${
                        isSelected ? "text-blue-700" : "text-slate-900"
                      }`}
                    >
                      {dateObj.getDate()}
                    </span>

                    <span
                      className={`text-[10px] font-bold ${
                        isSelected ? "text-blue-400" : "text-slate-400"
                      }`}
                    >
                      Tháng {dateObj.getMonth() + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TIME */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <ClockIcon className="size-4 text-blue-500" />

              <h3 className="text-sm font-black uppercase tracking-widest">
                Giờ trống
              </h3>
            </div>

            {selectedDate ? (
              isLoadingSlots ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-12 rounded-xl bg-slate-100 animate-pulse border border-slate-200/50"
                    />
                  ))}
                </div>
              ) : doctorSlots.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {doctorSlots.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      const isDisabled = !slot.available;

                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={isDisabled}
                          title={
                            slot.reason ||
                            (slot.available
                              ? "Khung giờ trống"
                              : "Không thể đặt")
                          }
                          onClick={() => !isDisabled && onTimeChange(slot.time)}
                          className={`group relative flex flex-col items-center justify-center h-12 rounded-xl text-xs font-black transition-all ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105 z-10"
                              : isDisabled
                                ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
                                : "bg-white text-slate-700 border border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
                          }`}
                        >
                          <span>{slot.time}</span>
                          {slot.reason && isDisabled && (
                            <span className="text-[9px] font-normal text-slate-400 line-clamp-1">
                              {slot.reason === "Đã có người đặt"
                                ? "Đã đặt"
                                : slot.reason === "Đã qua khung giờ khám"
                                  ? "Đã qua"
                                  : slot.reason === "Bác sĩ nghỉ phép"
                                    ? "Bác sĩ nghỉ"
                                    : "Bận"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Chú thích trạng thái */}
                  <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-blue-600" />
                      <span>Đang chọn</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full border border-slate-300 bg-white" />
                      <span>Có thể đặt</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-slate-200" />
                      <span>Đã đặt / Đã qua giờ</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center border-2 border-dashed border-amber-200 bg-amber-50/50 rounded-2xl text-amber-700 text-xs font-semibold">
                  Bác sĩ không có lịch làm việc trong ngày này. Quý khách vui
                  lòng chọn ngày khác.
                </div>
              )
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-medium">
                Vui lòng chọn ngày khám ở trên để hiển thị giờ trống
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-12 px-6 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
        >
          <ChevronLeftIcon className="mr-2 size-4" /> Quay lại chọn bác sĩ
        </Button>

        {selectedServiceId && selectedDate && selectedTime ? (
          <Button
            onClick={onContinue}
            className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 group"
          >
            Điền thông tin & Xác nhận
            <ArrowRightIcon className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        ) : (
          <p className="text-xs font-semibold text-slate-400 italic">
            {!selectedServiceId
              ? "Vui lòng chọn dịch vụ"
              : !selectedDate
                ? "Vui lòng chọn ngày khám"
                : "Vui lòng chọn khung giờ để tiếp tục"}
          </p>
        )}
      </div>
    </div>
  );
}

export default TimeSelectionStep;
