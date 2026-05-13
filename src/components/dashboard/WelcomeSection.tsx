import { currentUser } from "@clerk/nextjs/server";
import { SparklesIcon, CalendarCheckIcon, ShieldCheckIcon } from "lucide-react";

export default async function WelcomeSection() {
  const user = await currentUser();
  const hours = new Date().getHours();
  const greeting = hours < 12 ? "buổi sáng" : hours < 18 ? "buổi chiều" : "buổi tối";

  return (
    <div className="relative z-10 bg-[#1d4ed8] rounded-[2.5rem] p-8 md:p-12 border border-white/10 mb-12 overflow-hidden shadow-2xl shadow-blue-900/20">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 size-64 bg-blue-400/20 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 size-48 bg-cyan-400/10 rounded-full blur-2xl -ml-10 -mb-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/90">Trực tuyến & Sẵn sàng</span>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              Chào {greeting}, <span className="text-blue-200">{user?.firstName}!</span>
            </h1>
            <p className="text-blue-100 font-medium text-lg max-w-xl leading-relaxed">
              Trợ lý nha khoa AI cá nhân của bạn đã sẵn sàng hỗ trợ chăm sóc sức khỏe răng miệng toàn diện.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { icon: ShieldCheckIcon, text: "Bảo mật y tế" },
              { icon: CalendarCheckIcon, text: "Đặt lịch nhanh" },
              { icon: SparklesIcon, text: "AI Thông minh" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-blue-100 text-xs font-bold">
                <div className="size-6 bg-white/10 rounded-lg flex items-center justify-center">
                  <Icon className="size-3" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Logo/Icon Area */}
        <div className="hidden lg:flex items-center justify-center size-40 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl relative group overflow-hidden transition-transform hover:scale-105 duration-500">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent" />
           <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="relative z-10 animate-float">
                <path
                  d="M12 2C9.5 2 7.5 3.5 6 5C4.5 6.5 4 8 4 10C4 12.5 5 14.5 5.5 16.5C6 18.5 6 21 8 22C9.5 22 10 20 10.5 18.5C11 17 11.5 16 12 16C12.5 16 13 17 13.5 18.5C14 20 14.5 22 16 22C18 21 18 18.5 18.5 16.5C19 14.5 20 12.5 20 10C20 8 19.5 6.5 18 5C16.5 3.5 14.5 2 12 2Z"
                  fill="white"
                />
            </svg>
        </div>
      </div>
    </div>
  );
}
