"use client";

import { useState } from "react";
import {
  useGetAppointments,
  useUpdateAppointmentStatus,
} from "@/hooks/use-appointment";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AppointmentsManagementPage() {
  const { data: appointments = [] } = useGetAppointments();

  const updateMutation = useUpdateAppointmentStatus();

  const [search, setSearch] = useState("");

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patientName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleToggleStatus = (
    id: string,
    currentStatus: string
  ) => {
    const newStatus =
      currentStatus === "CONFIRMED"
        ? "COMPLETED"
        : "CONFIRMED";

    updateMutation.mutate({
      id,
      status: newStatus,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900">
          Quản lý lịch hẹn
        </h1>

        <p className="text-slate-500 mt-2">
          Theo dõi và cập nhật trạng thái lịch khám khách hàng
        </p>
      </div>

      <Card className="rounded-[2rem] border-slate-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Danh sách lịch hẹn
          </CardTitle>

          <Input
            placeholder="Tìm bệnh nhân..."
            className="max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardHeader>

        <CardContent>
          <div className="rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>Bác sĩ</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Giờ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <div className="font-semibold">
                          {appointment.patientName}
                        </div>

                        <div className="text-sm text-slate-500">
                          {appointment.patientEmail}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {appointment.doctorName}
                    </TableCell>

                    <TableCell>
                      {new Date(
                        appointment.date
                      ).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      {appointment.time}
                    </TableCell>

                    <TableCell>
                      {appointment.status === "CONFIRMED" ? (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                          Đã xác nhận
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Hoàn thành
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleToggleStatus(
                            appointment.id,
                            appointment.status
                          )
                        }
                      >
                        Đổi trạng thái
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AppointmentsManagementPage;