"use client";

import { useMemo, useState } from "react";

import {
  useGetAppointments,
  useUpdateAppointmentStatus,
} from "@/hooks/use-appointment";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function AppointmentsManagementPage() {
  const { data: appointments = [] } =
    useGetAppointments();

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const filteredAppointments =
    useMemo(() => {
      return [...appointments]
        .filter((appointment) => {
          const matchesSearch =
            appointment.patientName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =
            statusFilter === "ALL"
              ? true
              : appointment.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        })

        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        );
    }, [
      appointments,
      search,
      statusFilter,
    ]);

  const updateAppointmentMutation =
    useUpdateAppointmentStatus();

  const completedCount =
    appointments.filter(
      (a) =>
        a.status === "COMPLETED"
    ).length;

  const confirmedCount =
    appointments.filter(
      (a) =>
        a.status === "CONFIRMED"
    ).length;

  const cancelledCount =
    appointments.filter(
      (a) =>
        a.status === "CANCELLED"
    ).length;

  const getStatusBadge = (
    status: string
  ) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="rounded-full border-0 bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100">
            Đã xác nhận
          </Badge>
        );

      case "COMPLETED":
        return (
          <Badge className="rounded-full border-0 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100">
            Hoàn thành
          </Badge>
        );

      case "CANCELLED":
        return (
          <Badge className="rounded-full border-0 bg-red-100 px-3 py-1 text-xs font-bold text-red-700 hover:bg-red-100">
            Đã huỷ
          </Badge>
        );

      default:
        return (
          <Badge>
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8">

      {/* HERO */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#7c3aed] p-10 text-white shadow-xl shadow-blue-200">

        <div className="flex items-center gap-5">

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">

            <Calendar className="size-8 text-white" />

          </div>

          <div>

            <h1 className="text-5xl font-black">
              Quản lý lịch hẹn
            </h1>

            <p className="mt-3 text-lg text-blue-100">
              Theo dõi và cập nhật trạng thái lịch khám khách hàng theo thời gian thực
            </p>

          </div>
        </div>

        {/* STATS */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">

            <p className="text-sm font-semibold text-blue-100">
              Tổng lịch hẹn
            </p>

            <div className="mt-3 flex items-center justify-between">

              <h3 className="text-4xl font-black">
                {appointments.length}
              </h3>

              <Calendar className="size-8 text-white/80" />

            </div>

          </div>

          <div className="rounded-3xl bg-emerald-400/20 p-5 backdrop-blur">

            <p className="text-sm font-semibold text-emerald-100">
              Hoàn thành
            </p>

            <div className="mt-3 flex items-center justify-between">

              <h3 className="text-4xl font-black">
                {completedCount}
              </h3>

              <CheckCircle2 className="size-8 text-emerald-100" />

            </div>

          </div>

          <div className="rounded-3xl bg-red-400/20 p-5 backdrop-blur">

            <p className="text-sm font-semibold text-red-100">
              Đã huỷ
            </p>

            <div className="mt-3 flex items-center justify-between">

              <h3 className="text-4xl font-black">
                {cancelledCount}
              </h3>

              <XCircle className="size-8 text-red-100" />

            </div>

          </div>

        </div>
      </div>

      {/* TABLE */}
      <Card className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">

        <CardHeader className="border-b border-slate-100 bg-white px-8 py-7">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <CardTitle className="text-3xl font-black text-slate-900">
                Danh sách lịch hẹn
              </CardTitle>

              <p className="mt-2 text-sm font-medium text-slate-400">
                Theo dõi và quản lý lịch khám khách hàng
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative">

                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Tìm kiếm bệnh nhân..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white"
                />

              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition-all focus:border-blue-500 focus:bg-white"
              >

                <option value="ALL">
                  Tất cả trạng thái
                </option>

                <option value="CONFIRMED">
                  Đã xác nhận
                </option>

                <option value="COMPLETED">
                  Hoàn thành
                </option>

                <option value="CANCELLED">
                  Đã huỷ
                </option>

              </select>

            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">

          <div className="overflow-x-auto">

            <Table className="table-fixed">

              <TableHeader>

                <TableRow className="border-b border-slate-100 bg-slate-50/70 hover:bg-slate-50/70">

                  <TableHead className="w-[260px] px-8 text-xs font-black uppercase tracking-wider text-slate-500">
                    Bệnh nhân
                  </TableHead>

                  <TableHead className="w-[140px] text-xs font-black uppercase tracking-wider text-slate-500">
                    Bác sĩ
                  </TableHead>

                  <TableHead className="w-[140px] text-xs font-black uppercase tracking-wider text-slate-500">
                    Ngày khám
                  </TableHead>

                  <TableHead className="w-[140px] text-xs font-black uppercase tracking-wider text-slate-500">
                    Dịch vụ
                  </TableHead>

                  <TableHead className="w-[140px] text-xs font-black uppercase tracking-wider text-slate-500">
                    Trạng thái
                  </TableHead>

                  <TableHead className="w-[160px] text-xs font-black uppercase tracking-wider text-slate-500">
                    Hành động
                  </TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>

                {filteredAppointments.length >
                  0 ? (

                  filteredAppointments.map(
                    (appointment) => (

                      <TableRow
                        key={
                          appointment.id
                        }
                        className="border-b border-slate-100 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-indigo-50/40"
                      >

                        {/* PATIENT */}
                        <TableCell className="px-8 py-6">

                          <div className="flex items-center gap-4">

                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                appointment.patientName
                              )}&background=4f46e5&color=ffffff&bold=true`}
                              alt={
                                appointment.patientName
                              }
                              className="h-14 w-14 rounded-full shadow-md"
                            />

                            <div>

                              <div className="font-bold text-slate-900">
                                {
                                  appointment.patientName
                                }
                              </div>

                              <div
                                className="max-w-[220px] truncate text-sm text-slate-500"
                              >
                                {
                                  appointment.patientEmail
                                }
                              </div>

                            </div>

                          </div>
                        </TableCell>

                        {/* DOCTOR */}
                        <TableCell>

                          <div className="font-semibold text-slate-700">

                            {
                              appointment.doctorName
                            }

                          </div>

                        </TableCell>

                        {/* DATE */}
                        <TableCell>

                          <div>

                            <div className="font-semibold text-slate-800">

                              {new Date(
                                appointment.date
                              ).toLocaleDateString(
                                "vi-VN"
                              )}

                            </div>

                            <div className="mt-1 text-sm text-slate-500">

                              {
                                appointment.time
                              }

                            </div>

                          </div>

                        </TableCell>

                        {/* SERVICE */}
                        <TableCell>

                          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">

                            {
                              appointment.reason
                            }

                          </span>

                        </TableCell>

                        {/* STATUS */}
                        <TableCell>

                          {getStatusBadge(
                            appointment.status
                          )}

                        </TableCell>

                        {/* ACTION */}
                        <TableCell>

                          <select
                            value={
                              appointment.status
                            }
                            onChange={(e) =>
                              updateAppointmentMutation.mutate(
                                {
                                  id:
                                    appointment.id,

                                  status:
                                    e.target
                                      .value as
                                    | "CONFIRMED"
                                    | "COMPLETED"
                                    | "CANCELLED",
                                }
                              )
                            }
                            className="h-12 w-[160px] cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 font-semibold shadow-xl shadow-slate-100 outline-none transition-all hover:border-blue-300 focus:border-blue-500"
                          >

                            <option value="CONFIRMED">
                              Đã xác nhận
                            </option>

                            <option value="COMPLETED">
                              Hoàn thành
                            </option>

                            <option value="CANCELLED">
                              Đã huỷ
                            </option>

                          </select>

                        </TableCell>

                      </TableRow>
                    )
                  )
                ) : (

                  <TableRow>

                    <TableCell
                      colSpan={6}
                      className="h-60 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50">

                          <Clock3 className="size-8 text-blue-600" />

                        </div>

                        <h3 className="text-xl font-black text-slate-900">

                          Chưa có lịch hẹn

                        </h3>

                        <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500">

                          Các lịch khám sẽ xuất hiện tại đây để quản lý và theo dõi.

                        </p>

                      </div>

                    </TableCell>

                  </TableRow>
                )}

              </TableBody>

            </Table>
          </div>

          {/* FOOTER */}
          <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-8 py-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="text-sm font-medium text-slate-500">

              Hiển thị{" "}

              <span className="font-black text-slate-900">

                {
                  filteredAppointments.length
                }

              </span>{" "}

              lịch hẹn

            </div>

            <div className="flex items-center gap-3">

              <button className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition-all hover:border-blue-300 hover:text-blue-700">

                ← Trước

              </button>

              <div className="flex items-center gap-2">

                <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-200">

                  1

                </button>

                <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition-all hover:border-blue-300 hover:text-blue-700">

                  2

                </button>

              </div>

              <button className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition-all hover:border-blue-300 hover:text-blue-700">

                Sau →

              </button>

            </div>

          </div>

        </CardContent>
      </Card>
    </div>
  );
}

export default AppointmentsManagementPage;