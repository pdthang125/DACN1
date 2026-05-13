"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { CalendarIcon, HomeIcon, MicIcon, Sparkles } from "lucide-react";
import Link from "next/image"; // Error here? Wait, Navbar uses next/link
import NextLink from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 bg-[#1d4ed8] shadow-lg shadow-blue-900/20 h-16 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
        {/* LOGO */}
        <div className="flex items-center gap-10">
          <NextLink href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative size-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors" />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C9.5 2 7.5 3.5 6 5C4.5 6.5 4 8 4 10C4 12.5 5 14.5 5.5 16.5C6 18.5 6 21 8 22C9.5 22 10 20 10.5 18.5C11 17 11.5 16 12 16C12.5 16 13 17 13.5 18.5C14 20 14.5 22 16 22C18 21 18 18.5 18.5 16.5C19 14.5 20 12.5 20 10C20 8 19.5 6.5 18 5C16.5 3.5 14.5 2 12 2Z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="font-black text-xl text-white tracking-tight">
              Dent<span className="text-blue-200">Wise</span>
            </span>
          </NextLink>

          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/dashboard", icon: HomeIcon, label: "Trang chủ" },
              { href: "/appointments", icon: CalendarIcon, label: "Lịch hẹn" },
              { href: "/voice", icon: MicIcon, label: "Trợ lý AI" },
            ].map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <NextLink
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    isActive
                      ? "bg-white text-blue-700 shadow-md"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : ""}`} />
                  <span>{label}</span>
                </NextLink>
              );
            })}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-sm font-black text-white leading-tight">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">
                Thành viên Bạc
              </span>
            </div>

            <div className="size-10 rounded-full border-2 border-white/20 p-0.5 shadow-lg">
              <UserButton appearance={{ elements: { userButtonAvatarBox: "size-full" } }} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
