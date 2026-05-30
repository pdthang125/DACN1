"use client";

import { useState } from "react";

import { useGetAppointments } from "@/hooks/use-appointment";

import { Users, Search } from "lucide-react";

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

function CustomersManagementPage() {

  const {
    data: appointments = [],
  } = useGetAppointments();

  const [search, setSearch] =
    useState("");

  const uniqueCustomers = Array.from(
    new Map(
      appointments.map((appointment) => [
        appointment.patientEmail,
        {
          name: appointment.patientName,
          email: appointment.patientEmail,
          phone: appointment.phoneNumber,
          appointmentsCount:
            appointments.filter(
              (a) =>
                a.patientEmail ===
                appointment.patientEmail
            ).length,
        },
      ])
    ).values()
  );

  const filteredCustomers =
    uniqueCustomers.filter(
      (customer) =>
        customer.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        customer.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#7c3aed] p-10 text-white shadow-xl shadow-blue-200">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-5">

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">

              <Users className="size-8 text-white" />

            </div>

            <div>

              <h1 className="text-5xl font-black">
                Quản lý khách hàng
              </h1>

              <p className="mt-3 text-lg text-blue-100">
                Theo dõi khách hàng và
                lịch hẹn theo thời gian thực
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm font-semibold text-slate-400">
            Tổng khách hàng
          </p>

          <h3 className="mt-2 text-4xl font-black text-slate-900">
            {uniqueCustomers.length}
          </h3>

        </div>

        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">

          <p className="text-sm font-semibold text-emerald-600">
            Đang hoạt động
          </p>

          <h3 className="mt-2 text-4xl font-black text-emerald-700">
            {uniqueCustomers.length}
          </h3>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

          <p className="text-sm font-semibold text-blue-600">
            Tổng lịch hẹn
          </p>

          <h3 className="mt-2 text-4xl font-black text-blue-700">

            {appointments.length}

          </h3>

        </div>

      </div>

      {/* TABLE */}

      <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">

        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <CardTitle className="text-2xl font-black text-slate-900">
              Danh sách khách hàng
            </CardTitle>

            <p className="mt-1 text-sm text-slate-500">
              Theo dõi thông tin khách hàng
            </p>

          </div>

          {/* SEARCH */}

          <div className="relative w-full md:max-w-sm">

            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500"
            />

          </div>

        </CardHeader>

        <CardContent>

          <div className="overflow-hidden rounded-3xl border border-slate-100">

            <Table>

              <TableHeader>

                <TableRow className="bg-slate-50 hover:bg-slate-50">

                  <TableHead className="h-14 text-sm font-bold uppercase tracking-wide text-slate-500">
                    Khách hàng
                  </TableHead>

                  <TableHead className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    Số điện thoại
                  </TableHead>

                  <TableHead className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    Số lịch hẹn
                  </TableHead>

                  <TableHead className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    Trạng thái
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {filteredCustomers.map(
                  (customer, index) => (

                    <TableRow
                      key={index}
                      className="transition-all hover:bg-slate-50"
                    >

                      <TableCell>

                        <div className="flex items-center gap-4">

                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              customer.name
                            )}&background=4f46e5&color=ffffff&bold=true`}
                            alt={customer.name}
                            className="h-12 w-12 rounded-full"
                          />

                          <div>

                            <div className="font-bold text-slate-900">
                              {customer.name}
                            </div>

                            <div className="max-w-[220px] truncate text-sm text-slate-500">
                              {customer.email}
                            </div>

                          </div>

                        </div>

                      </TableCell>

                      <TableCell className="font-medium text-slate-700">

                        {customer.phone}

                      </TableCell>

                      <TableCell>

                        <div className="font-bold text-slate-900">

                          {customer.appointmentsCount}

                        </div>

                      </TableCell>

                      <TableCell>

                        <div
                          className={`inline-flex rounded-xl px-3 py-1 text-sm font-semibold ${customer.appointmentsCount > 1
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                            }`}
                        >

                          {customer.appointmentsCount > 1
                            ? "Bệnh nhân cũ"
                            : "Bệnh nhân mới"}

                        </div>

                      </TableCell>

                    </TableRow>
                  )
                )}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}

export default CustomersManagementPage;