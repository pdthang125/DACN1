"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { MenuIcon, XIcon } from "lucide-react";

const navLinks = [
  { href: "#how-it-works", label: "Quy trình" },
  { href: "#features", label: "Tính năng AI" },
  { href: "#pricing", label: "Bảng giá" },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-[#1d4ed8] shadow-lg shadow-blue-900/30"
        : "bg-gradient-to-r from-[#1e40af] to-[#1d4ed8]"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
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
              Smile<span className="text-blue-200">Care</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-4 py-2 text-sm font-semibold text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="font-semibold text-blue-100 hover:text-white hover:bg-white/10 rounded-lg">
                Đăng nhập
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm" className="font-bold bg-white text-blue-700 hover:bg-blue-50 border-0 shadow-md shadow-blue-900/20 rounded-lg px-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
                Bắt đầu miễn phí
              </Button>
            </SignUpButton>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-white/10 pt-3">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-sm font-semibold text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="flex-1 text-blue-100 hover:bg-white/10 text-sm font-semibold">Đăng nhập</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="flex-1 bg-white text-blue-700 font-bold text-sm">Đăng ký</Button>
              </SignUpButton>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
