"use client";

import {
  useGetAppointments,
  useUpdateAppointmentStatus,
} from "@/hooks/use-appointment";

import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  Calendar,
  CheckCircle2,
  Clock3,
  UserRound,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Button } from "../ui/button";

function RecentAppointments() {
  const { data: appointments = [] } = useGetAppointments();

  const updateAppointmentMutation =
    useUpdateAppointmentStatus();

  const handleToggleAppointmentStatus = (
    appointmentId: string
  ) => {
    const appointment = appointments.find(
      (apt) => apt.id === appointmentId
    );

    const newStatus =
      appointment?.status === "CONFIRMED"
        ? "COMPLETED"
        : "CONFIRMED";

    updateAppointmentMutation.mutate({
      id: appointmentId,
      status: newStatus,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 rounded-xl px-3 py-1 font-bold">
            Đã xác nhận
          </Badge>
        );

      case "COMPLETED":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 rounded-xl px-3 py-1 font-bold">
            Hoàn thành
          </Badge>
        );

      default:
        return (
          <Badge className="rounded-xl px-3 py-1">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="border-0 rounded-[2rem] shadow-sm">
      
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <CardTitle className="flex items-center gap-4">
            
            <div className="size-14 rounded-3xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-200">
              <Calendar className="size-6 text-white" />
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-900">
                Quản lý lịch hẹn
              </h2>

              <p className="text-slate-400 text-sm font-medium mt-1">
                Theo dõi và quản lý toàn bộ lịch khám khách hàng
              </p>
            </div>
          </CardTitle>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-5 py-3 rounded-2xl">
          <div className="size-2 rounded-full bg-green-500 animate-pulse" />

          <span className="text-sm font-bold text-slate-600">
            Hệ thống hoạt động
          </span>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200">
          
          <Table className="table-fixed">
            
            {/* Header */}
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                
                <TableHead className="w-[22%]">BỆNH NHÂN</TableHead>

                <TableHead className="w-[18%]">BÁC SĨ</TableHead>

                <TableHead className="w-[20%]">NGÀY KHÁM</TableHead>

                <TableHead className="w-[20%]">DỊCH VỤ</TableHead>

                <TableHead className="w-[12%]">TRẠNG THÁI</TableHead>

                <TableHead className="w-[15%] text-right">HÀNH ĐỘNG</TableHead>
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody>
  {appointments.length > 0 ? (
    appointments.map((appointment) => (
      <TableRow key={appointment.id}>
        <TableCell>
          <div>
            <div className="font-medium">{appointment.patientName}</div>
            <div className="text-sm text-muted-foreground">
              {appointment.patientEmail}
            </div>
          </div>
        </TableCell>

        <TableCell className="font-medium">
          {appointment.doctorName}
        </TableCell>

        <TableCell>
          <div>
            <div className="font-medium">
              {new Date(appointment.date).toLocaleDateString("vi-VN")}
            </div>
            <div className="text-sm text-muted-foreground">
              {appointment.time}
            </div>
          </div>
        </TableCell>

        <TableCell>{appointment.reason}</TableCell>

        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleAppointmentStatus(appointment.id)}
            className="h-6 px-2"
          >
            {getStatusBadge(appointment.status)}
          </Button>
        </TableCell>

        <TableCell className="text-right">
          <div className="text-xs text-muted-foreground">
            Nhấn để đổi trạng thái
          </div>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell
        colSpan={6}
        className="h-56 text-center"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Calendar className="size-8 text-blue-600" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            Chưa có lịch hẹn nào
          </h3>

          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Các lịch hẹn của khách hàng sẽ xuất hiện tại đây để quản lý và theo dõi.
          </p>
        </div>
      </TableCell>
    </TableRow>
  )}
</TableBody>

          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentAppointments;