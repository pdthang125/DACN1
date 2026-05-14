"use client";

import { useGetAppointments } from "@/hooks/use-appointment";

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

function CustomersManagementPage() {
  const { data: appointments = [] } = useGetAppointments();

  const uniqueCustomers = Array.from(
    new Map(
      appointments.map((appointment) => [
        appointment.patientEmail,
        {
          name: appointment.patientName,
          email: appointment.patientEmail,
          phone: appointment.phoneNumber,
          appointmentsCount: appointments.filter(
            (a) =>
              a.patientEmail === appointment.patientEmail
          ).length,
        },
      ])
    ).values()
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900">
          Quản lý khách hàng
        </h1>

        <p className="text-slate-500 mt-2">
          Theo dõi danh sách khách hàng đã đặt lịch
        </p>
      </div>

      <Card className="rounded-[2rem] border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle>
            Danh sách khách hàng
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Số lịch hẹn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {uniqueCustomers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold">
                      {customer.name}
                    </TableCell>

                    <TableCell>
                      {customer.email}
                    </TableCell>

                    <TableCell>
                      {customer.phone}
                    </TableCell>

                    <TableCell>
                      {customer.appointmentsCount}
                    </TableCell>

                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Đang hoạt động
                      </Badge>
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

export default CustomersManagementPage;