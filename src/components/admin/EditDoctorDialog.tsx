"use client";

import { useUpdateDoctor } from "@/hooks/use-doctors";

import { formatPhoneNumber } from "@/lib/utils";

import {
  Doctor,
  Gender,
} from "@prisma/client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Label } from "../ui/label";

import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Button } from "../ui/button";

interface EditDoctorDialogProps {
  isOpen: boolean;

  onClose: () => void;

  doctor: Doctor | null;
}

function EditDoctorDialog({
  doctor,
  isOpen,
  onClose,
}: EditDoctorDialogProps) {

  const [editingDoctor, setEditingDoctor] =
    useState<Doctor | null>(doctor);

  const updateDoctorMutation =
    useUpdateDoctor();

  useEffect(() => {
    setEditingDoctor(doctor);
  }, [doctor]);

  const handlePhoneChange = (
    value: string
  ) => {
    const formattedPhoneNumber =
      formatPhoneNumber(value);

    if (editingDoctor) {
      setEditingDoctor({
        ...editingDoctor,
        phone:
          formattedPhoneNumber,
      });
    }
  };

  const handleSave = () => {
    if (editingDoctor) {
      updateDoctorMutation.mutate(
        { ...editingDoctor },
        {
          onSuccess:
            handleClose,
        }
      );
    }
  };

  const handleClose = () => {
    onClose();

    setEditingDoctor(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className="sm:max-w-2xl rounded-[32px]">

        <DialogHeader>

          <DialogTitle>
            Chỉnh sửa bác sĩ
          </DialogTitle>

          <DialogDescription>
            Cập nhật thông tin
            và trạng thái bác sĩ
          </DialogDescription>

        </DialogHeader>

        {editingDoctor && (

          <div className="grid gap-5 py-4">

            {/* IMAGE */}
            <div className="space-y-2">

              <Label>
                Ảnh bác sĩ
              </Label>

              <Input
                value={
                  editingDoctor.imageUrl
                }
                onChange={(e) =>
                  setEditingDoctor({
                    ...editingDoctor,

                    imageUrl:
                      e.target.value,
                  })
                }
                placeholder="/doctor/doctor1.png"
              />
            </div>

            {/* NAME + SPECIALITY */}
            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">

                <Label>
                  Họ tên
                </Label>

                <Input
                  value={
                    editingDoctor.name
                  }
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,

                      name:
                        e.target
                          .value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">

                <Label>
                  Chuyên khoa
                </Label>

                <Input
                  value={
                    editingDoctor.speciality
                  }
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,

                      speciality:
                        e.target
                          .value,
                    })
                  }
                />
              </div>

            </div>

            {/* EMAIL */}
            <div className="space-y-2">

              <Label>Email</Label>

              <Input
                type="email"
                value={
                  editingDoctor.email
                }
                onChange={(e) =>
                  setEditingDoctor({
                    ...editingDoctor,

                    email:
                      e.target
                        .value,
                  })
                }
              />
            </div>

            {/* PHONE */}
            <div className="space-y-2">

              <Label>
                Số điện thoại
              </Label>

              <Input
                value={
                  editingDoctor.phone
                }
                onChange={(e) =>
                  handlePhoneChange(
                    e.target.value
                  )
                }
                placeholder="0905123456"
              />
            </div>

            {/* BIO */}
            <div className="space-y-2">

              <Label>
                Giới thiệu
              </Label>

              <Input
                value={
                  editingDoctor.bio ||
                  ""
                }
                onChange={(e) =>
                  setEditingDoctor({
                    ...editingDoctor,

                    bio:
                      e.target
                        .value,
                  })
                }
                placeholder="Mô tả bác sĩ..."
              />
            </div>

            {/* GENDER + STATUS */}
            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">

                <Label>
                  Giới tính
                </Label>

                <Select
                  value={
                    editingDoctor.gender
                  }
                  onValueChange={(
                    value
                  ) =>
                    setEditingDoctor({
                      ...editingDoctor,

                      gender:
                        value as Gender,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="MALE">
                      Nam
                    </SelectItem>

                    <SelectItem value="FEMALE">
                      Nữ
                    </SelectItem>

                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">

                <Label>
                  Trạng thái
                </Label>

                <Select
                  value={
                    editingDoctor.isActive
                      ? "active"
                      : "inactive"
                  }
                  onValueChange={(
                    value
                  ) =>
                    setEditingDoctor({
                      ...editingDoctor,

                      isActive:
                        value ===
                        "active",
                    })
                  }
                >
                  <SelectTrigger
                    className={
                      editingDoctor.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="active">
                      Đang hoạt động
                    </SelectItem>

                    <SelectItem value="inactive">
                      Ngưng hoạt động
                    </SelectItem>

                  </SelectContent>
                </Select>
              </div>

            </div>

          </div>
        )}

        <DialogFooter>

          <Button
            variant="outline"
            onClick={handleClose}
          >
            Huỷ
          </Button>

          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={
              updateDoctorMutation.isPending
            }
          >
            {updateDoctorMutation.isPending
              ? "Đang lưu..."
              : "Lưu thay đổi"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}

export default EditDoctorDialog;