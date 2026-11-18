
"use client";

import {
  bookAppointment,
  getAppointments,
  getBookedTimeSlots,
  getDoctorAvailableSlots,
  getUserAppointments,
  cancelAppointment,
  startAppointment,
  completeAppointment,
  markAppointmentNoShow,
} from "@/lib/actions/appointments";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const appointmentKeys = {
  all: ["getAppointments"] as const,
  user: ["getUserAppointments"] as const,
  doctorSlots: (doctorId: string, date: string, serviceId?: string) =>
    ["getDoctorAvailableSlots", doctorId, date, serviceId || ""] as const,
  bookedTimeSlots: (doctorId: string, date: string, serviceId?: string) =>
    ["getBookedTimeSlots", doctorId, date, serviceId || ""] as const,
};

// Lấy danh sách lịch hẹn cho màn hình quản lý
export function useGetAppointments() {
  return useQuery({
    queryKey: appointmentKeys.all,
    queryFn: () => getAppointments(),
  });
}

// Lấy toàn bộ các khung giờ và trạng thái rảnh/bận của bác sĩ từ BE
export function useDoctorAvailableSlots(
  doctorId: string,
  date: string,
  serviceId?: string,
) {
  return useQuery({
    queryKey: appointmentKeys.doctorSlots(doctorId, date, serviceId),
    queryFn: () => getDoctorAvailableSlots(doctorId, date, serviceId),
    enabled: Boolean(doctorId && date),
  });
}

// Lấy khung giờ đã đặt theo bác sĩ và ngày (dành cho tương thích ngược)
export function useBookedTimeSlots(
  doctorId: string,
  date: string,
  serviceId?: string,
) {
  return useQuery({
    queryKey: appointmentKeys.bookedTimeSlots(doctorId, date, serviceId),
    queryFn: () => getBookedTimeSlots(doctorId, date, serviceId),
    enabled: Boolean(doctorId && date),
  });
}

// Lấy lịch hẹn của người dùng hiện tại
export function useUserAppointments() {
  return useQuery({
    queryKey: appointmentKeys.user,
    queryFn: getUserAppointments,
    refetchInterval: ({ state }) =>
      state.data?.some((appointment) => appointment.payment != null)
        ? 5_000
        : false,
  });
}

// Hàm dùng chung để invalidate cache lịch hẹn
function useInvalidateAppointments() {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.all,
      }),
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.user,
      }),
      queryClient.invalidateQueries({
        queryKey: ["getDoctorAvailableSlots"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["getBookedTimeSlots"],
      }),
    ]);
  };
}

// Đặt lịch hẹn
export function useBookAppointment() {
  const invalidateAppointments = useInvalidateAppointments();

  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: (result) => {
      if (result.ok) return invalidateAppointments();
    },
    onError: (error) => {
      console.error("Failed to book appointment:", error);
    },
  });
}

// Hủy lịch hẹn
export function useCancelAppointment() {
  const invalidateAppointments = useInvalidateAppointments();

  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: invalidateAppointments,
    onError: (error) => {
      console.error("Failed to cancel appointment:", error);
    },
  });
}

// Bắt đầu khám
export function useStartAppointment() {
  const invalidateAppointments = useInvalidateAppointments();

  return useMutation({
    mutationFn: startAppointment,
    onSuccess: invalidateAppointments,
    onError: (error) => {
      console.error("Failed to start appointment:", error);
    },
  });
}

// Hoàn thành khám
export function useCompleteAppointment() {
  const invalidateAppointments = useInvalidateAppointments();

  return useMutation({
    mutationFn: completeAppointment,
    onSuccess: invalidateAppointments,
    onError: (error) => {
      console.error("Failed to complete appointment:", error);
    },
  });
}

// Đánh dấu bệnh nhân không đến
export function useMarkAppointmentNoShow() {
  const invalidateAppointments = useInvalidateAppointments();

  return useMutation({
    mutationFn: markAppointmentNoShow,
    onSuccess: invalidateAppointments,
    onError: (error) => {
      console.error("Failed to mark appointment as no-show:", error);
    },
  });
}
