"use client";

import { AppointmentConfirmationModal } from "@/components/appointments/AppointmentConfirmationModal";
import BookingConfirmationStep from "@/components/appointments/BookingConfirmationStep";
import DoctorSelectionStep from "@/components/appointments/DoctorSelectionStep";
import ProgressSteps from "@/components/appointments/ProgressSteps";
import TimeSelectionStep from "@/components/appointments/TimeSelectionStep";
import Navbar from "@/components/Navbar";
import { useBookAppointment, useUserAppointments } from "@/hooks/use-appointment";
import { APPOINTMENT_TYPES } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import {
  CalendarIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "lucide-react";

function AppointmentsPage() {
  const [selectedDentistId, setSelectedDentistId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // NEW STATES
  const [phoneNumber, setPhoneNumber] = useState("");
  const [symptom, setSymptom] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);

  const bookAppointmentMutation = useBookAppointment();
  const { data: userAppointments = [] } = useUserAppointments();

  const handleSelectDentist = (dentistId: string) => {
    setSelectedDentistId(dentistId);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedType("");
  };

  const handleBookAppointment = async () => {
    if (
      !selectedDentistId ||
      !selectedDate ||
      !selectedTime ||
      !phoneNumber ||
      !symptom
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const appointmentType = APPOINTMENT_TYPES.find(
      (t) => t.id === selectedType
    );

    bookAppointmentMutation.mutate(
      {
        doctorId: selectedDentistId,
        date: selectedDate,
        time: selectedTime,
        reason: appointmentType?.name,

        // NEW DATA
        phoneNumber,
        symptom,
      },
      {
        onSuccess: async (appointment) => {
          setBookedAppointment(appointment);

          try {
            await fetch("/api/send-appointment-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userEmail: appointment.patientEmail,
                doctorName: appointment.doctorName,
                appointmentDate: format(
                  new Date(appointment.date),
                  "dd/MM/yyyy"
                ),
                appointmentTime: appointment.time,
                appointmentType: appointmentType?.name,
                duration: appointmentType?.duration,
                price: appointmentType?.price,
                symptom,
                phoneNumber,
              }),
            });
          } catch (error) {
            console.error("Error sending confirmation email:", error);
          }

          setShowConfirmationModal(true);

          setSelectedDentistId(null);
          setSelectedDate("");
          setSelectedTime("");
          setSelectedType("");

          setPhoneNumber("");
          setSymptom("");

          setCurrentStep(1);
        },

        onError: (error) =>
          toast.error(`Lỗi đặt lịch: ${error.message}`),
      }
    );
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
                Đặt Lịch{" "}
                <span className="text-blue-200">
                  Khám Nha Khoa
                </span>
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

                <span className="text-2xl font-black text-white">
                  15+
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-blue-200 font-bold uppercase">
                  Hài lòng
                </span>

                <span className="text-2xl font-black text-white">
                  99%
                </span>
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
                selectedType={selectedType}

                // NEW PROPS
                phoneNumber={phoneNumber}
                symptom={symptom}
                onPhoneNumberChange={setPhoneNumber}
                onSymptomChange={setSymptom}

                onBack={() => setCurrentStep(1)}
                onContinue={() => setCurrentStep(3)}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
                onTypeChange={setSelectedType}
              />
            )}

            {currentStep === 3 && selectedDentistId && (
              <BookingConfirmationStep
                selectedDentistId={selectedDentistId}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedType={selectedType}
                isBooking={bookAppointmentMutation.isPending}
                onBack={() => setCurrentStep(2)}
                onModify={() => setCurrentStep(2)}
                onConfirm={handleBookAppointment}
              />
            )}
          </div>
        </div>

        {/* APPOINTMENTS */}
        {userAppointments.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <ClockIcon className="size-5 text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
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

                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md">
                        {appointment.reason || "Khám tổng quát"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-medium">
                        Ngày khám
                      </span>

                      <span className="text-slate-900 font-black">
                        {format(
                          new Date(appointment.date),
                          "dd/MM/yyyy"
                        )}
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
                    Đã xác nhận
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {bookedAppointment && (
        <AppointmentConfirmationModal
          open={showConfirmationModal}
          onOpenChange={setShowConfirmationModal}
          appointmentDetails={{
            doctorName: bookedAppointment.doctorName,
            appointmentDate: format(
              new Date(bookedAppointment.date),
              "dd/MM/yyyy"
            ),
            appointmentTime: bookedAppointment.time,
            userEmail: bookedAppointment.patientEmail,
          }}
        />
      )}
    </div>
  );
}

export default AppointmentsPage;