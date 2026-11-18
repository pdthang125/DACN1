import { APPOINTMENT_TYPES } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  ChevronLeftIcon,
  CheckCircle2Icon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  WalletIcon,
  ArrowRightIcon,
  Settings2Icon,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import DoctorInfo from "./DoctorInfo";
import { useState } from "react";
import { PatientInput } from "@/lib/services/appointments.service";
import type { ServiceOption } from "./TimeSelectionStep";

export interface BookingFormData {
  patient: PatientInput;
  appointment: {
    symptom: string;
    notes: string;
  };
}
interface BookingConfirmationStepProps {
  selectedDentistId: string;
  selectedDate: string;
  selectedTime: string;
  selectedType: string;
  services?: ServiceOption[];
  isBooking: boolean;
  onBack: () => void;
  onModify: () => void;
  onConfirm: (data: BookingFormData) => void;
}

function BookingConfirmationStep({
  selectedDentistId,
  selectedDate,
  selectedTime,
  selectedType,
  services,
  isBooking,
  onBack,
  onConfirm,
  onModify,
}: BookingConfirmationStepProps) {
  const matchedService = services?.find((s) => s.id === selectedType);
  const appointmentType = matchedService
    ? {
        name: matchedService.name,
        duration: `${matchedService.durationMinutes} phút`,
        price:
          typeof matchedService.price === "number"
            ? matchedService.price === 0
              ? "Miễn phí"
              : `${matchedService.price.toLocaleString("vi-VN")}đ`
            : matchedService.price,
      }
    : APPOINTMENT_TYPES.find((t) => t.id === selectedType);
  const [formData, setFormData] = useState<BookingFormData>({
    patient: {
      fullName: "",
      dateOfBirth: "",
      gender: "OTHER",
      phone: "",
      nationalId: "",
      address: "",
      emergencyContact: "",
      bloodType: "",
      allergies: "",
      medicalAlerts: "",
      isPrimary: true,
    },
    appointment: {
      symptom: "",
      notes: "",
    },
  });

  const handleChange = (
    section: "patient" | "appointment",
    field: string,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleConfirm = () => {
    onConfirm(formData);
  };
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            Xác nhận Lịch hẹn
          </h2>
        </div>
      </div>

      {/* Patient Information Form */}
      <Card className="border-slate-100 rounded-[2rem] shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Thông tin bệnh nhân
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Vui lòng cung cấp thông tin người trực tiếp đến khám.
            </p>
          </div>

          {/* Người khám */}
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={formData.patient.isPrimary}
              onChange={(e) =>
                handleChange("patient", "isPrimary", e.target.checked)
              }
            />
            Tôi là người trực tiếp đến khám
          </label>

          {/* Basic information */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-bold">Họ và tên *</label>
              <input
                required
                value={formData.patient.fullName}
                onChange={(e) =>
                  handleChange("patient", "fullName", e.target.value)
                }
                className="w-full mt-2 rounded-xl border p-3"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Ngày sinh *</label>
              <input
                required
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={formData.patient.dateOfBirth}
                onChange={(e) =>
                  handleChange("patient", "dateOfBirth", e.target.value)
                }
                className="w-full mt-2 rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Giới tính *</label>
              <select
                required
                value={formData.patient.gender}
                onChange={(e) =>
                  handleChange("patient", "gender", e.target.value)
                }
                className="w-full mt-2 rounded-xl border p-3"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold">Số điện thoại</label>
              <input
                type="tel"
                value={formData.patient.phone}
                onChange={(e) =>
                  handleChange("patient", "phone", e.target.value)
                }
                className="w-full mt-2 rounded-xl border p-3"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label className="text-sm font-bold">CCCD</label>
              <input
                value={formData.patient.nationalId}
                onChange={(e) =>
                  handleChange("patient", "nationalId", e.target.value)
                }
                className="w-full mt-2 rounded-xl border p-3"
                placeholder="Số CCCD"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Nhóm máu</label>
              <select
                value={formData.patient.bloodType}
                onChange={(e) =>
                  handleChange("patient", "bloodType", e.target.value)
                }
                className="w-full mt-2 rounded-xl border p-3"
              >
                <option value="">Chưa xác định</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold">Địa chỉ</label>
            <input
              value={formData.patient.address}
              onChange={(e) =>
                handleChange("patient", "address", e.target.value)
              }
              className="w-full mt-2 rounded-xl border p-3"
              placeholder="Địa chỉ hiện tại"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Người liên hệ khẩn cấp</label>
            <input
              value={formData.patient.emergencyContact}
              onChange={(e) =>
                handleChange("patient", "emergencyContact", e.target.value)
              }
              className="w-full mt-2 rounded-xl border p-3"
              placeholder="Tên và số điện thoại người liên hệ"
            />
          </div>

          {/* Medical information */}
          <div className="border-t pt-6 space-y-5">
            <h4 className="font-black text-slate-900">Thông tin sức khỏe</h4>

            <div>
              <label className="text-sm font-bold">Dị ứng</label>
              <textarea
                rows={2}
                value={formData.patient.allergies}
                onChange={(e) =>
                  handleChange("patient", "allergies", e.target.value)
                }
                className="w-full mt-2 rounded-xl border p-3"
                placeholder="Ví dụ: Dị ứng thuốc tê, kháng sinh..."
              />
            </div>

            <div>
              <label className="text-sm font-bold">
                Bệnh nền / Cảnh báo y tế
              </label>
              <textarea
                rows={2}
                value={formData.patient.medicalAlerts}
                onChange={(e) =>
                  handleChange("patient", "medicalAlerts", e.target.value)
                }
                className="w-full mt-2 rounded-xl border p-3"
                placeholder="Ví dụ: Tiểu đường, tim mạch, máu khó đông..."
              />
            </div>
          </div>

          {/* Current appointment */}
          <div className="border-t pt-6 space-y-5">
            <h4 className="font-black text-slate-900">
              Thông tin lần khám này
            </h4>

            <div>
              <label className="text-sm font-bold">
                Triệu chứng hiện tại *
              </label>
              <textarea
                required
                rows={3}
                value={formData.appointment.symptom}
                onChange={(e) =>
                  handleChange("appointment", "symptom", e.target.value)
                }
                className="w-full mt-2 rounded-xl border p-3"
                placeholder="Mô tả tình trạng răng miệng hiện tại..."
              />
            </div>

            <div>
              <label className="text-sm font-bold">Ghi chú thêm</label>
              <textarea
                rows={2}
                value={formData.appointment.notes}
                onChange={(e) =>
                  handleChange("appointment", "notes", e.target.value)
                }
                className="w-full mt-2 rounded-xl border p-3"
                placeholder="Thông tin bổ sung cho bác sĩ..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-slate-100 overflow-hidden shadow-xl shadow-blue-900/5 rounded-[2rem]">
            <CardContent className="p-8 space-y-8">
              {/* Doctor */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Bác sĩ phụ trách
                </p>
                <DoctorInfo doctorId={selectedDentistId} />
              </div>

              {/* Appointment Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Settings2Icon className="size-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Dịch vụ
                    </span>
                  </div>
                  <p className="font-black text-slate-900">
                    {appointmentType?.name}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {appointmentType?.duration}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CalendarIcon className="size-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Ngày khám
                    </span>
                  </div>
                  <p className="font-black text-slate-900">
                    {new Date(selectedDate).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ClockIcon className="size-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Giờ khám
                    </span>
                  </div>
                  <p className="font-black text-blue-600 text-lg">
                    {selectedTime}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPinIcon className="size-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Địa điểm
                    </span>
                  </div>
                  <p className="font-black text-slate-900">
                    Nha khoa SmileCare
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    TP. Hồ Chí Minh
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900 border-none rounded-[2rem] shadow-2xl shadow-blue-900/20 text-white overflow-hidden relative">
            {/* Decoration */}
            <div className="absolute top-0 right-0 size-32 bg-blue-500/20 rounded-full blur-3xl" />

            <CardContent className="p-8 space-y-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <WalletIcon className="size-5 text-blue-400" />
                </div>
                <h3 className="font-black text-lg">Tóm tắt chi phí</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">
                    Phí dịch vụ
                  </span>
                  <span className="font-black">{appointmentType?.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">
                    Phí đặt lịch (AI)
                  </span>
                  <span className="text-emerald-400 font-black">Miễn phí</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-slate-400 font-medium text-sm">
                    Tổng cộng
                  </span>
                  <span className="text-3xl font-black text-blue-400">
                    {appointmentType?.price}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleConfirm}
                  disabled={isBooking}
                  className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base shadow-xl shadow-blue-900/40 transition-all hover:-translate-y-1 group"
                >
                  {isBooking ? (
                    <span className="flex items-center gap-2">
                      <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Xác nhận Đặt lịch{" "}
                      <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={onModify}
                  className="w-full h-12 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 font-bold"
                >
                  Thay đổi thông tin
                </Button>
              </div>

              <div className="flex items-start gap-2 pt-2 text-[10px] text-slate-500 font-medium leading-relaxed">
                <CheckCircle2Icon className="size-3 text-emerald-500 shrink-0 mt-0.5" />
                Bằng cách nhấn xác nhận, bạn đồng ý với các điều khoản dịch vụ
                và chính sách bảo mật của SmileCare.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmationStep;
