"use client";

import { useEffect, useState } from "react";
import {
  UserButton,
  useUser,
  SignOutButton,
} from "@clerk/nextjs";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  Settings,
  Brain,
  Building2,
  UserCog,
  Save,
  LogOut,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();

  const [clinicName, setClinicName] =
    useState("");

  const [hotline, setHotline] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [aiEnabled, setAiEnabled] =
    useState(true);

  const [
    predictEnabled,
    setPredictEnabled,
  ] = useState(true);

  const [
    overloadEnabled,
    setOverloadEnabled,
  ] = useState(true);

  useEffect(() => {
    const settings =
      localStorage.getItem(
        "clinicSettings"
      );

    if (settings) {
      const parsed =
        JSON.parse(settings);

      setClinicName(
        parsed.clinicName || ""
      );

      setHotline(
        parsed.hotline || ""
      );

      setEmail(
        parsed.email || ""
      );

      setAddress(
        parsed.address || ""
      );

      setAiEnabled(
        parsed.aiEnabled ?? true
      );

      setPredictEnabled(
        parsed.predictEnabled ?? true
      );

      setOverloadEnabled(
        parsed.overloadEnabled ?? true
      );
    } else {
      setClinicName(
        "SmileCare Dental"
      );

      setHotline(
        "0905666789"
      );

      setEmail(
        "smilecare@gmail.com"
      );

      setAddress(
        "Đà Nẵng"
      );
    }
  }, []);

  const handleSaveSettings =
    () => {
      localStorage.setItem(
        "clinicSettings",
        JSON.stringify({
          clinicName,
          hotline,
          email,
          address,
          aiEnabled,
          predictEnabled,
          overloadEnabled,
        })
      );

      alert(
        "Đã lưu cài đặt thành công!"
      );
    };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">

            <Settings className="h-7 w-7" />

          </div>

          <div>

            <h1 className="text-4xl font-black">
              Cài đặt hệ thống
            </h1>

            <p className="mt-2 text-blue-100">
              Quản lý cấu hình phòng khám và AI
            </p>

          </div>

        </div>

      </div>

      {/* Thông tin phòng khám */}

      <Card className="rounded-[2rem]">

        <CardContent className="p-8">

          <div className="mb-6 flex items-center gap-3">

            <Building2 className="h-6 w-6 text-blue-600" />

            <h2 className="text-2xl font-black">
              Thông tin phòng khám
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <Label>
                Tên phòng khám
              </Label>

              <Input
                value={clinicName}
                onChange={(e) =>
                  setClinicName(
                    e.target.value
                  )
                }
              />

            </div>

            <div>

              <Label>
                Hotline
              </Label>

              <Input
                value={hotline}
                onChange={(e) =>
                  setHotline(
                    e.target.value
                  )
                }
              />

            </div>

            <div>

              <Label>
                Email
              </Label>

              <Input
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

            </div>

            <div>

              <Label>
                Địa chỉ
              </Label>

              <Input
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          <Button
            onClick={
              handleSaveSettings
            }
            className="mt-6"
          >

            <Save className="mr-2 h-4 w-4" />

            Lưu thay đổi

          </Button>

        </CardContent>

      </Card>

      {/* AI Configuration */}

      <Card className="rounded-[2rem]">

        <CardContent className="p-8">

          <div className="mb-6 flex items-center gap-3">

            <Brain className="h-6 w-6 text-violet-600" />

            <h2 className="text-2xl font-black">
              AI Configuration
            </h2>

          </div>

          <div className="space-y-5">

  <div className="flex items-center gap-3">

    <div className="h-3 w-3 rounded-full bg-green-500"></div>

    <span className="font-bold text-green-600">
      Đang hoạt động
    </span>

  </div>

  <div className="rounded-xl border p-4">

    <p className="font-bold">
      ✓ AI phân tích lịch hẹn
    </p>

    <p className="text-sm text-slate-500">
      Phân tích dữ liệu lịch khám của bệnh nhân
    </p>

  </div>

  <div className="rounded-xl border p-4">

    <p className="font-bold">
      ✓ Dự đoán giờ cao điểm
    </p>

    <p className="text-sm text-slate-500">
      Xác định các khung giờ có lượng đặt lịch cao
    </p>

  </div>

  <div className="rounded-xl border p-4">

    <p className="font-bold">
      ✓ Cảnh báo quá tải lịch khám
    </p>

    <p className="text-sm text-slate-500">
      Hỗ trợ quản lý lịch hẹn hiệu quả hơn
    </p>

  </div>

  <div className="rounded-xl bg-slate-50 p-4">

    <p>
      <strong>Mô hình:</strong>
      {" "}
      Rule-Based Analytics
    </p>

    <p>
      <strong>Dữ liệu:</strong>
      {" "}
      Lịch hẹn nha khoa
    </p>

    <p>
      <strong>Phiên bản:</strong>
      {" "}
      AI Monitor v1.0
    </p>

  </div>

</div>

        </CardContent>

      </Card>

      {/* Tài khoản Admin */}

      <Card className="rounded-[2rem]">

        <CardContent className="p-8">

          <div className="mb-6 flex items-center gap-3">

            <UserCog className="h-6 w-6 text-emerald-600" />

            <h2 className="text-2xl font-black">
              Tài khoản quản trị
            </h2>

          </div>

          <div className="flex items-center gap-4">

            <UserButton />

            <div>

              <p className="font-bold">
                {user?.fullName}
              </p>

              <p className="text-sm text-slate-500">
                {
                  user
                    ?.primaryEmailAddress
                    ?.emailAddress
                }
              </p>

              <p className="text-xs text-emerald-600">
                Đăng nhập bằng Google
              </p>

            </div>

          </div>

          <div className="mt-6">

            <SignOutButton>

              <Button
                variant="destructive"
              >

                <LogOut className="mr-2 h-4 w-4" />

                Đăng xuất

              </Button>

            </SignOutButton>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}