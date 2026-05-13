import Image from "next/image";
import { MessageSquareIcon, PhoneIcon, MailIcon, MapPinIcon } from "lucide-react";

const navGroups = [
  {
    title: "Dịch vụ",
    links: [
      { href: "#how-it-works", label: "Quy trình" },
      { href: "#features", label: "Tính năng AI" },
      { href: "#pricing", label: "Bảng giá" },
      { href: "#", label: "Đặt lịch khám" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { href: "#", label: "Trung tâm trợ giúp" },
      { href: "#", label: "Liên hệ chúng tôi" },
      { href: "#", label: "Câu hỏi thường gặp" },
      { href: "#", label: "Trạng thái hệ thống" },
    ],
  },
  {
    title: "Pháp lý",
    links: [
      { href: "#", label: "Chính sách bảo mật" },
      { href: "#", label: "Điều khoản sử dụng" },
      { href: "#", label: "Chính sách cookie" },
    ],
  },
];

const contacts = [
  { icon: PhoneIcon, text: "1800 1234 (Miễn phí)" },
  { icon: MailIcon, text: "support@dentwise.vn" },
  { icon: MapPinIcon, text: "TP. Hồ Chí Minh, Việt Nam" },
];

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Top blue accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C9.5 2 7.5 3.5 6 5C4.5 6.5 4 8 4 10C4 12.5 5 14.5 5.5 16.5C6 18.5 6 21 8 22C9.5 22 10 20 10.5 18.5C11 17 11.5 16 12 16C12.5 16 13 17 13.5 18.5C14 20 14.5 22 16 22C18 21 18 18.5 18.5 16.5C19 14.5 20 12.5 20 10C20 8 19.5 6.5 18 5C16.5 3.5 14.5 2 12 2Z"
                    fill="white"
                  />
                </svg>
              </div>
              <span className="font-black text-xl text-white">
                Smile<span className="text-blue-400">Care</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed font-medium max-w-xs">
              Nền tảng nha khoa thông minh — kết hợp AI tiên tiến và đội ngũ bác sĩ tâm huyết để mang đến nụ cười khỏe mạnh cho mọi người Việt Nam.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              {contacts.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-slate-400 hover:text-slate-200 transition-colors group">
                  <div className="size-8 bg-slate-800 group-hover:bg-blue-600/20 rounded-lg flex items-center justify-center transition-colors">
                    <Icon className="size-4 text-blue-400" />
                  </div>
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Online badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
              <span className="size-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-slate-300">Hỗ trợ 24/7 — Luôn sẵn sàng</span>
            </div>
          </div>

          {/* Nav groups */}
          {navGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-3 h-0.5 bg-blue-500 rounded-full" />
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map(({ href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-slate-400 hover:text-blue-400 font-medium transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 rounded-full transition-all duration-300" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 text-center md:text-left">
              © 2025 SmileCare. Được xây dựng với ❤️ cho sức khỏe răng miệng cộng đồng Việt Nam.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 font-medium">Ngôn ngữ:</span>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-xs font-bold text-blue-400">
                🇻🇳 Tiếng Việt
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
