"use client";

import { useCreateDoctor } from "@/hooks/use-doctors";
import { Gender } from "@prisma/client";
import { useState } from "react";

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

import { formatPhoneNumber } from "@/lib/utils";

interface AddDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddDoctorDialog({
  isOpen,
  onClose,
}: AddDoctorDialogProps) {

  const [newDoctor, setNewDoctor] =
    useState({
      name: "",
      email: "",
      phone: "",
      speciality: "",
      bio: "",
      imageUrl:
        "/doctor/doctor1.png",
      gender: "MALE" as Gender,
      isActive: true,
    });

  const createDoctorMutation =
    useCreateDoctor();

  const handlePhoneChange = (
    value: string
  ) => {
    const formattedPhoneNumber =
      formatPhoneNumber(value);

    setNewDoctor({
      ...newDoctor,
      phone: formattedPhoneNumber,
    });
  };

  const handleSave = () => {
    createDoctorMutation.mutate(
      { ...newDoctor },
      {
        onSuccess: handleClose,
      }
    );
  };

  const handleClose = () => {
    onClose();

    setNewDoctor({
      name: "",
      email: "",
      phone: "",
      speciality: "",
      bio: "",
      imageUrl:
        "/doctor/doctor1.png",
      gender: "MALE",
      isActive: true,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl">

        <DialogHeader>
          <DialogTitle>
            Thêm bác sĩ mới
          </DialogTitle>

          <DialogDescription>
            Thêm bác sĩ vào hệ thống SmileCare
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">

          {/* IMAGE URL */}
          <div className="space-y-2">
            <Label>
              Ảnh bác sĩ
            </Label>

            <Input
              value={newDoctor.imageUrl}
              onChange={(e) =>
                setNewDoctor({
                  ...newDoctor,
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
                Họ tên *
              </Label>

              <Input
                value={newDoctor.name}
                onChange={(e) =>
                  setNewDoctor({
                    ...newDoctor,
                    name:
                      e.target.value,
                  })
                }
                placeholder="VD: Nguyễn Minh Anh"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Chuyên khoa *
              </Label>

              <Input
                value={
                  newDoctor.speciality
                }
                onChange={(e) =>
                  setNewDoctor({
                    ...newDoctor,
                    speciality:
                      e.target.value,
                  })
                }
                placeholder="VD: Chỉnh nha"
              />
            </div>

          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label>Email *</Label>

            <Input
              type="email"
              value={newDoctor.email}
              onChange={(e) =>
                setNewDoctor({
                  ...newDoctor,
                  email:
                    e.target.value,
                })
              }
              placeholder="doctor@gmail.com"
            />
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <Label>
              Số điện thoại
            </Label>

            <Input
              value={newDoctor.phone}
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
              Giới thiệu bác sĩ
            </Label>

            <Input
              value={newDoctor.bio}
              onChange={(e) =>
                setNewDoctor({
                  ...newDoctor,
                  bio:
                    e.target.value,
                })
              }
              placeholder="Mô tả ngắn về bác sĩ..."
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
                  newDoctor.gender
                }
                onValueChange={(
                  value
                ) =>
                  setNewDoctor({
                    ...newDoctor,
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
                  newDoctor.isActive
                    ? "active"
                    : "inactive"
                }
                onValueChange={(
                  value
                ) =>
                  setNewDoctor({
                    ...newDoctor,
                    isActive:
                      value ===
                      "active",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="active">
                    Đang hoạt động
                  </SelectItem>

                  <SelectItem value="inactive">
                    Tạm ngưng
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

        </div>

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
              !newDoctor.name ||
              !newDoctor.email ||
              !newDoctor.speciality ||
              createDoctorMutation.isPending
            }
          >
            {createDoctorMutation.isPending
              ? "Đang thêm..."
              : "Thêm bác sĩ"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}

export default AddDoctorDialog;