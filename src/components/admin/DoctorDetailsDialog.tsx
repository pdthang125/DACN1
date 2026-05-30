"use client";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";

import {
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

import { Doctor } from "@prisma/client";

interface Props {
  doctor: Doctor | null;

  isOpen: boolean;

  onClose: () => void;
}

function DoctorDetailsDialog({
  doctor,
  isOpen,
  onClose,
}: Props) {
  if (!doctor) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-2xl overflow-hidden rounded-[32px] border-0 p-0">

        {/* Hidden title for accessibility */}
        <DialogHeader className="hidden">
          <DialogTitle>
            Chi tiết bác sĩ
          </DialogTitle>
        </DialogHeader>

        {/* Cover */}
        <div className="relative h-40 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content */}
        <div className="relative px-8 pb-8">

          {/* Avatar */}
          <div className="-mt-16 relative z-10">
            <Image
              src={
                doctor.imageUrl ||
                "/doctor/doctor1.png"
              }
              alt={doctor.name}
              width={120}
              height={120}
              className="h-32 w-32 rounded-3xl border-4 border-white object-cover shadow-xl"
            />
          </div>

          {/* Name */}
          <div className="mt-5 flex items-start justify-between">

            <div>
              <h2 className="text-3xl font-black text-slate-900">
                {doctor.name}
              </h2>

              <p className="mt-2 text-lg font-medium text-slate-500">
                {doctor.speciality}
              </p>
            </div>

            {doctor.isActive ? (
              <Badge className="rounded-2xl bg-emerald-100 px-4 py-2 text-emerald-700 hover:bg-emerald-100">
                Đang hoạt động
              </Badge>
            ) : (
              <Badge variant="secondary">
                Ngưng hoạt động
              </Badge>
            )}
          </div>

          {/* Bio */}
          <div className="mt-8 rounded-3xl bg-slate-50 p-6">

            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
              GIỚI THIỆU
            </h3>

            <p className="mt-3 leading-8 text-slate-600">
              {doctor.bio ||
                "Chưa có mô tả bác sĩ"}
            </p>

          </div>

          {/* Info */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 p-5">

              <div className="flex items-center gap-3">

                <Mail className="size-5 text-blue-600" />

                <div>
                  <p className="text-sm text-slate-400">
                    Email
                  </p>

                  <p className="font-semibold text-slate-800">
                    {doctor.email}
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">

              <div className="flex items-center gap-3">

                <Phone className="size-5 text-emerald-600" />

                <div>
                  <p className="text-sm text-slate-400">
                    Số điện thoại
                  </p>

                  <p className="font-semibold text-slate-800">
                    {doctor.phone}
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">

              <div className="flex items-center gap-3">

                <Calendar className="size-5 text-violet-600" />

                <div>
                  <p className="text-sm text-slate-400">
                    Trạng thái
                  </p>

                  <p className="font-semibold text-slate-800">
                    {doctor.isActive
                      ? "Đang hoạt động"
                      : "Tạm ngưng"}
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">

              <div className="flex items-center gap-3">

                <div className="size-5 rounded-full bg-pink-500" />

                <div>
                  <p className="text-sm text-slate-400">
                    Giới tính
                  </p>

                  <p className="font-semibold text-slate-800">
                    {doctor.gender ===
                    "MALE"
                      ? "Nam"
                      : "Nữ"}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DoctorDetailsDialog;