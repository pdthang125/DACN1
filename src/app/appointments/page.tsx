"use client";

import BookingConfirmationStep, {
  type BookingFormData,
} from "@/components/appointments/BookingConfirmationStep";
import DoctorSelectionStep from "@/components/appointments/DoctorSelectionStep";
import ProgressSteps from "@/components/appointments/ProgressSteps";
import TimeSelectionStep from "@/components/appointments/TimeSelectionStep";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  useBookAppointment,
  useCancelAppointment,
  useUserAppointments,
} from "@/hooks/use-appointment";
import { useActiveServices } from "@/hooks/use-services";
import type { BookAppointmentRequest } from "@/lib/services/appointments.service";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarIcon, ClockIcon, ShieldCheckIcon } from "lucide-react";


function AppointmentsPage() {
  const [selectedDentistId, setSelectedDentistId] = useState<string | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [selectedServiceId, setSelectedServiceId] = useState("");

  const {
    data: services = [],
    isPending: isLoadingServices,
    isError: hasServicesError,
    refetch: refetchServices,
  } = useActiveServices();
  const selectedService = services.find((service) => service.id === selectedServiceId);

  const [currentStep, setCurrentStep] = useState(1);

  const bookAppointmentMutation = useBookAppointment();
  const cancelAppointmentMutation = useCancelAppointment();
  const { data: userAppointments = [], refetch: refetchAppointments } =
    useUserAppointments();

  async function handleCancelAppointment(appointmentId: string) {
    if (!window.confirm("Bạn có chắc muốn hủy lịch đang chờ đặt cọc?")) return;

    try {
      await cancelAppointmentMutation.mutateAsync({
        appointmentId,
        expectedStatus: "PENDING_PAYMENT",
      });
      toast.success("Đã hủy lịch hẹn.");
    } catch {
      toast.error("Không thể hủy lịch. Vui lòng kiểm tra lại trạng thái lịch hẹn.");
      void refetchAppointments();
    }
  }

  const handleBookingConfirm = async (formData: BookingFormData) => {
    if (
      !selectedDentistId ||
      !selectedDate ||
      !selectedTime ||
      !selectedServiceId
    ) {
      toast.error("Vui lòng chọn bác sĩ, ngày, giờ và dịch vụ");
      return;
    }

    if (
      !formData.patient.fullName.trim() ||
      !formData.patient.dateOfBirth ||
      !formData.appointment.symptom.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    if (!selectedService) {
      handleUnavailableService();
      return;
    }

    const request: BookAppointmentRequest = {
      doctorId: selectedDentistId,
      date: selectedDate,
      time: selectedTime,
      serviceId: selectedServiceId,
      patient: {
        ...formData.patient,
        fullName: formData.patient.fullName.trim(),
      },
      symptom: formData.appointment.symptom.trim(),
      notes: formData.appointment.notes?.trim() || undefined,
      phoneNumber: formData.patient.phone?.trim() || undefined,
    };

    try {
      const result = await bookAppointmentMutation.mutateAsync(request);
      if (!result.ok) {
        handleUnavailableService();
        return;
      }
      toast.info("Lịch đang chờ đặt cọc.", {
        description: "Quét mã QR trong mục Lịch hẹn của bạn để thanh toán.",
        action: {
          label: "Xem lịch hẹn",
          onClick: () =>
            document.getElementById("user-appointments")?.scrollIntoView(),
        },
      });

      setSelectedDentistId(null);
      setSelectedDate("");
      setSelectedTime("");
      setSelectedServiceId("");
      setCurrentStep(1);
    } catch (error) {
      // Chỉ xử lý lỗi tạo Appointment
      toast.error(
        `Lỗi đặt lịch: ${
          error instanceof Error ? error.message : "Không xác định"
        }`,
      );
    }
  };

  function handleUnavailableService() {
    toast.error("Dịch vụ đã chọn không còn khả dụng. Vui lòng chọn lại.");
    setSelectedServiceId("");
    setSelectedTime("");
    setCurrentStep(2);
    void refetchServices();
  }

  const handleSelectDentist = (dentistId: string) => {
    setSelectedDentistId(dentistId);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedServiceId("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* HEADER */}
      <div className="bg-[#1d4ed8] pt-32 pb-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="absolute -top-24 -right-24 size-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white/90">
                <CalendarIcon className="size-3" />
                Hệ thống đặt lịch thông minh
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Đặt Lịch <span className="text-blue-200">Khám Nha Khoa</span>
              </h1>

              <p className="text-blue-100 font-medium text-lg max-w-xl">
                Lựa chọn bác sĩ giỏi và khung giờ phù hợp nhất với bạn.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="flex flex-col items-center gap-1 border-r border-white/10 pr-4">
                <span className="text-xs text-blue-200 font-bold uppercase">
                  Bác sĩ
                </span>

                <span className="text-2xl font-black text-white">15+</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-blue-200 font-bold uppercase">
                  Hài lòng
                </span>

                <span className="text-2xl font-black text-white">99%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20 pb-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 p-8 md:p-12">
          <ProgressSteps currentStep={currentStep} />

          <div className="mt-4">
            {currentStep === 1 && (
              <DoctorSelectionStep
                selectedDentistId={selectedDentistId}
                onContinue={() => setCurrentStep(2)}
                onSelectDentist={handleSelectDentist}
              />
            )}

            {currentStep === 2 && selectedDentistId && (
              <TimeSelectionStep
                selectedDentistId={selectedDentistId}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedServiceId={selectedService?.id ?? ""}
                services={services}
                onBack={() => setCurrentStep(1)}
                onContinue={() => setCurrentStep(3)}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
                onServiceChange={(serviceId) => {
                  if (serviceId === selectedServiceId) return;
                  setSelectedServiceId(serviceId);
                  setSelectedTime("");
                }}
              />
            )}

            {currentStep === 3 && selectedDentistId && (
              <BookingConfirmationStep
                selectedDentistId={selectedDentistId}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedType={selectedServiceId}
                services={services}
                isBooking={bookAppointmentMutation.isPending}
                onBack={() => setCurrentStep(2)}
                onModify={() => setCurrentStep(2)}
                onConfirm={handleBookingConfirm}
              />
            )}
          </div>
        </div>

        {/* APPOINTMENTS */}
        {userAppointments.length > 0 && (
          <section
            id="user-appointments"
            aria-labelledby="user-appointments-title"
            className="mt-16 scroll-mt-28"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <ClockIcon className="size-5 text-white" />
              </div>

              <div>
                <h2
                  id="user-appointments-title"
                  className="text-2xl font-black text-slate-900 tracking-tight"
                >
                  Lịch hẹn của bạn
                </h2>

                <p className="text-sm text-slate-500 font-medium">
                  Theo dõi các buổi khám sắp tới
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-14 rounded-2xl overflow-hidden border-2 border-blue-50 shadow-md">
                      <img
                        src={
                          appointment.doctorImageUrl ||
                          "https://github.com/shadcn.png"
                        }
                        alt={appointment.doctorName}
                        className="size-full object-cover"
                      />
                    </div>

                    <div>
                      <p className="font-black text-slate-900 text-base">
                        {appointment.doctorName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-medium">
                        Ngày khám
                      </span>

                      <span className="text-slate-900 font-black">
                        {format(new Date(appointment.date), "dd/MM/yyyy")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-medium">
                        Giờ khám
                      </span>

                      <span className="text-blue-600 font-black">
                        {appointment.time}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full w-fit">
                    <ShieldCheckIcon className="size-3" />
                    {appointment.paymentExpired ? "Đã hết hạn đặt cọc" : ({
                      PENDING_PAYMENT: "Chờ đặt cọc",
                      CONFIRMED: "Đã xác nhận",
                      IN_PROGRESS: "Đang khám",
                      COMPLETED: "Đã hoàn thành",
                      CANCELLED: "Đã hủy",
                      NO_SHOW: "Không đến",
                      RESCHEDULE_PENDING: "Chờ đổi lịch",
                      EXPIRED: "Đã hết hạn đặt cọc",
                    }[appointment.status])}
                  </div>
                  {appointment.payment && (
                    <section className="mt-4 space-y-2">
                      <p className="text-sm text-slate-600">
                        Email xác nhận sẽ được gửi đến địa chỉ email tài khoản
                        sau khi hệ thống ghi nhận tiền cọc.
                      </p>
                      <p className="text-sm font-semibold">
                        Tiền cọc: {Number(appointment.payment.amount).toLocaleString("vi-VN")} ₫
                      </p>
                      <img src={appointment.payment.qrUrl} alt="Mã VietQR thanh toán tiền cọc" width={220} height={220} />
                      {appointment.payment.expiresAt && (
                        <p className="text-sm">Hạn thanh toán: {new Date(appointment.payment.expiresAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</p>
                      )}
                    </section>
                  )}
                  {appointment.status === "PENDING_PAYMENT" &&
                    !appointment.paymentExpired && (
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                        disabled={cancelAppointmentMutation.isPending}
                        onClick={() => void handleCancelAppointment(appointment.id)}
                      >
                        {cancelAppointmentMutation.isPending &&
                        cancelAppointmentMutation.variables.appointmentId === appointment.id
                          ? "Đang hủy…"
                          : "Hủy lịch"}
                      </Button>
                    )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>


    </div>
  );
}

export default AppointmentsPage;
