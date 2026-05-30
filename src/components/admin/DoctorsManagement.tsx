"use client";

import { useGetDoctors } from "@/hooks/use-doctors";
import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  EditIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  StethoscopeIcon,
  Search,
} from "lucide-react";

import { Button } from "../ui/button";
import Image from "next/image";
import { Badge } from "../ui/badge";

import AddDoctorDialog from "./AddDoctorDialog";
import EditDoctorDialog from "./EditDoctorDialog";
import DoctorDetailsDialog from "./DoctorDetailsDialog";

import { Doctor } from "@prisma/client";

function DoctorsManagement() {
  const {
    data: doctors = [],
    isLoading,
  } = useGetDoctors();

  const [
    isAddDialogOpen,
    setIsAddDialogOpen,
  ] = useState(false);

  const [
    isEditDialogOpen,
    setIsEditDialogOpen,
  ] = useState(false);

  const [
    isDetailsOpen,
    setIsDetailsOpen,
  ] = useState(false);

  const [search, setSearch] =
    useState("");
  const [genderFilter, setGenderFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [
    selectedDoctor,
    setSelectedDoctor,
  ] = useState<Doctor | null>(
    null
  );

  // OPEN DETAILS
  const handleOpenDoctorDetails = (
    doctor: Doctor
  ) => {
    setSelectedDoctor(doctor);

    setIsDetailsOpen(true);
  };

  // OPEN EDIT
  const handleEditDoctor = (
    doctor: Doctor
  ) => {
    setSelectedDoctor(doctor);

    setIsEditDialogOpen(true);
  };

  // CLOSE EDIT
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);

    setSelectedDoctor(null);
  };
  const filteredDoctors =
    useMemo(() => {
      return doctors.filter(
        (doctor) => {

          const matchSearch =
            doctor.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            doctor.speciality
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchGender =
            genderFilter === "ALL"
              ? true
              : doctor.gender ===
              genderFilter;

          const matchStatus =
            statusFilter === "ALL"
              ? true
              : statusFilter ===
                "ACTIVE"
                ? doctor.isActive
                : !doctor.isActive;

          return (
            matchSearch &&
            matchGender &&
            matchStatus
          );
        }
      );
    }, [doctors, search]);
  return (
    <>
      <Card className="mb-12 rounded-[2rem]  border-0 shadow-sm">

        {/* HEADER */}
        <CardHeader className="rounded-[2.5rem] border-0 bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#7c3aed] p-10 text-white shadow-xl shadow-blue-200">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-5">

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">

                <StethoscopeIcon className="size-8 text-white" />

              </div>

              <div>

                <CardTitle className="text-5xl font-black text-white">
                  Quản lý bác sĩ
                </CardTitle>

                <CardDescription className="mt-3 text-lg text-blue-100">
                  Quản lý thông tin và hoạt động của đội ngũ bác sĩ
                </CardDescription>

              </div>

            </div>

            <Button
              onClick={() =>
                setIsAddDialogOpen(true)
              }
              className="h-14 rounded-2xl bg-white px-6 text-base font-bold text-blue-700 hover:bg-blue-50"
            >

              <PlusIcon className="mr-2 size-5" />

              Thêm bác sĩ

            </Button>

          </div>

        </CardHeader>
        <div className="grid grid-cols-1 gap-5 px-6 pt-6 md:grid-cols-3">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-semibold text-slate-400">
              Tổng bác sĩ
            </p>

            <h3 className="mt-2 text-4xl font-black text-slate-900">
              {doctors.length}
            </h3>

          </div>

          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">

            <p className="text-sm font-semibold text-emerald-600">
              Đang hoạt động
            </p>

            <h3 className="mt-2 text-4xl font-black text-emerald-700">

              {
                doctors.filter(
                  (doctor) =>
                    doctor.isActive
                ).length
              }

            </h3>

          </div>

          <div className="rounded-3xl border border-red-100 bg-red-50 p-6">

            <p className="text-sm font-semibold text-red-600">
              Tạm nghỉ
            </p>

            <h3 className="mt-2 text-4xl font-black text-red-700">

              {
                doctors.filter(
                  (doctor) =>
                    !doctor.isActive
                ).length
              }

            </h3>

          </div>

        </div>

        {/* CONTENT */}
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row">

            {/* Search */}
            <div className="relative flex-1">

              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Tìm kiếm bác sĩ hoặc chuyên khoa..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500"
              />

            </div>

            {/* Gender */}
            <select
              value={genderFilter}
              onChange={(e) =>
                setGenderFilter(
                  e.target.value
                )
              }
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none"
            >
              <option value="ALL">
                Tất cả giới tính
              </option>

              <option value="MALE">
                Nam
              </option>

              <option value="FEMALE">
                Nữ
              </option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none"
            >
              <option value="ALL">
                Tất cả trạng thái
              </option>

              <option value="ACTIVE">
                Đang hoạt động
              </option>

              <option value="INACTIVE">
                Ngưng hoạt động
              </option>
            </select>
          </div>

          <div className="space-y-5">

            {isLoading ? (

              <div className="space-y-5">

                {[1, 2, 3].map((item) => (

                  <div
                    key={item}
                    className="animate-pulse rounded-[28px] border border-slate-200 bg-white p-6"
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex items-start gap-5">

                        <div className="h-16 w-16 rounded-2xl bg-slate-200" />

                        <div className="space-y-3">

                          <div className="h-5 w-40 rounded bg-slate-200" />

                          <div className="h-4 w-28 rounded bg-slate-200" />

                          <div className="h-4 w-72 rounded bg-slate-200" />

                          <div className="h-4 w-56 rounded bg-slate-200" />

                        </div>
                      </div>

                      <div className="space-y-3">

                        <div className="h-8 w-24 rounded bg-slate-200" />

                        <div className="h-9 w-28 rounded bg-slate-200" />

                      </div>
                    </div>
                  </div>
                ))}

              </div>

            ) : filteredDoctors.length > 0 ? (

              filteredDoctors.map((doctor) => (

                <div
                  key={doctor.id}
                  onClick={() =>
                    handleOpenDoctorDetails(
                      doctor
                    )
                  }
                  className="group cursor-pointer rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
                >

                  <div className="flex items-start justify-between gap-6">

                    {/* LEFT */}
                    <div className="flex items-start gap-5">

                      <Image
                        src={
                          doctor.imageUrl ||
                          "/doctor/doctor1.png"
                        }
                        alt={doctor.name}
                        width={64}
                        height={64}
                        className="size-16 rounded-2xl object-cover ring-4 ring-blue-50 transition-all duration-300 group-hover:ring-blue-100"
                      />

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-lg font-black text-slate-900">
                            {doctor.name}
                          </h3>

                          <span className="rounded-xl bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                            {doctor.gender ===
                              "MALE"
                              ? "Nam"
                              : "Nữ"}
                          </span>
                        </div>

                        <p className="mt-1 font-medium text-blue-600">
                          {doctor.speciality}
                        </p>

                        <p className="mt-3 max-w-[500px] text-sm leading-6 text-slate-500 line-clamp-2">
                          {doctor.bio ||
                            "Chưa có mô tả bác sĩ"}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-4">

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MailIcon className="h-4 w-4" />

                            {doctor.email}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <PhoneIcon className="h-4 w-4" />

                            {doctor.phone}
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-end gap-4">

                      <div className="text-right">

                        <div className="font-semibold text-primary">
                          {doctor.appointmentCount}
                        </div>

                        <div className="text-xs text-slate-500">
                          Lịch hẹn
                        </div>
                      </div>

                      <div
                        className={`rounded-xl px-4 py-2 text-sm font-semibold ${doctor.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {doctor.isActive
                          ? "Đang hoạt động"
                          : "Ngưng hoạt động"}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 rounded-xl border-slate-200 px-4"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleEditDoctor(
                            doctor
                          );
                        }}
                      >
                        <EditIcon className="mr-2 size-4" />
                        Chỉnh sửa
                      </Button>
                    </div>
                  </div>
                </div>
              ))

            ) : (

              <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-slate-50 py-20">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <StethoscopeIcon className="size-10 text-blue-600" />
                </div>

                <h3 className="mt-6 text-2xl font-black text-slate-900">
                  Không tìm thấy bác sĩ
                </h3>

                <p className="mt-2 text-slate-500">
                  Hãy thử tìm kiếm bằng tên hoặc chuyên khoa khác
                </p>
              </div>
            )}

          </div>
        </CardContent>
      </Card>

      {/* ADD */}
      <AddDoctorDialog
        isOpen={isAddDialogOpen}
        onClose={() =>
          setIsAddDialogOpen(false)
        }
      />

      {/* DETAILS */}
      <DoctorDetailsDialog
        doctor={selectedDoctor}
        isOpen={isDetailsOpen}
        onClose={() =>
          setIsDetailsOpen(false)
        }
      />

      {/* EDIT */}
      <EditDoctorDialog
        key={selectedDoctor?.id}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        doctor={selectedDoctor}
      />
    </>
  );
}

export default DoctorsManagement;