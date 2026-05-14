"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserRound,
  BarChart3,
  BrainCircuit,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Tổng quan",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },

  {
    title: "Lịch hẹn",
    href: "/dashboard/admin/appointments",
    icon: CalendarDays,
  },

  {
    title: "Bác sĩ",
    href: "/dashboard/admin/doctors",
    icon: UserRound,
  },

  {
    title: "Khách hàng",
    href: "/dashboard/admin/customers",
    icon: Users,
  },

  {
    title: "Thống kê",
    href: "/dashboard/admin/statistics",
    icon: BarChart3,
  },

  {
    title: "AI Phân tích",
    href: "/dashboard/admin/ai-monitor",
    icon: BrainCircuit,
  },

  {
    title: "Cài đặt",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-slate-200 shadow-sm flex flex-col">
      
      {/* Logo */}
      <div className="h-24 border-b border-slate-100 flex items-center px-8">
        <div>
          <h1 className="text-3xl font-black text-blue-600">
            SmileCare
          </h1>

          <p className="text-sm text-slate-400 font-medium">
            Hệ thống quản trị
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-semibold ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon className="size-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Bottom profile */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-100 rounded-3xl p-4">
          <p className="font-bold text-slate-900">
            Quản trị viên
          </p>

          <p className="text-sm text-slate-500">
            Quản trị hệ thống
          </p>
        </div>
      </div>
    </aside>
  );
}