import { SignUpButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { CalendarIcon, MessageSquareIcon, StarIcon, ShieldCheckIcon, UsersIcon, TrendingUpIcon } from "lucide-react";
import Image from "next/image";

const stats = [
  { icon: UsersIcon, value: "1,500+", label: "Bệnh nhân tin dùng" },
  { icon: StarIcon, value: "4.9/5", label: "Đánh giá trung bình" },
  { icon: TrendingUpIcon, value: "98%", label: "Hài lòng dịch vụ" },
  { icon: ShieldCheckIcon, value: "15+", label: "Bác sĩ chuyên khoa" },
];

function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#1e40af] via-[#1d4ed8] to-[#0369a1] overflow-hidden flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dots pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        {/* Glow orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-sky-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-indigo-300/20 rounded-full blur-2xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}
            <div className="space-y-8 text-white text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-green-400" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                  Nha khoa AI • Hỗ trợ 24/7
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                  Nụ cười khỏe,
                  <br />
                  <span className="text-blue-200">cuộc sống đẹp</span>
                </h1>
                <p className="text-lg md:text-xl text-blue-100 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                  Tư vấn nha khoa thông minh với AI, đặt lịch nhanh chóng và chăm sóc chuyên sâu từ đội ngũ bác sĩ hàng đầu — mọi lúc mọi nơi.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <SignUpButton mode="modal">
                  <Button size="lg" className="h-14 px-8 font-black text-base bg-white text-blue-700 hover:bg-blue-50 border-0 shadow-2xl shadow-blue-900/30 hover:shadow-blue-900/50 transition-all hover:-translate-y-1 rounded-2xl group">
                    <MessageSquareIcon className="mr-2 size-5 group-hover:scale-110 transition-transform" />
                    Chat AI miễn phí
                  </Button>
                </SignUpButton>
                <SignUpButton mode="modal">
                  <Button size="lg" variant="outline" className="h-14 px-8 font-bold text-base border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60 transition-all rounded-2xl backdrop-blur-sm">
                    <CalendarIcon className="mr-2 size-5" />
                    Đặt lịch khám
                  </Button>
                </SignUpButton>
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
                <div className="flex -space-x-3">
                  {[11, 12, 13, 14].map((i) => (
                    <Image
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i}`}
                      alt="User"
                      width={36}
                      height={36}
                      className="size-9 rounded-full border-2 border-white/60 object-cover"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-bold text-white">1,500+ khách hàng</div>
                  <div className="text-blue-200 font-medium">⭐⭐⭐⭐⭐ đánh giá xuất sắc</div>
                </div>
              </div>
            </div>

            {/* RIGHT – image */}
            <div className="relative hidden lg:flex justify-center items-center">
              {/* Floating image */}
              <div className="relative animate-float">
                {/* Glow */}
                <div className="absolute inset-0 bg-white/20 rounded-[3rem] blur-2xl scale-95" />
                <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white/30 shadow-2xl shadow-blue-900/50">
                  <Image
                    src="/modern_dental_hero_1778662471313.png"
                    alt="DentWise Dental Clinic"
                    width={560}
                    height={560}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  {/* Bottom overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-blue-900/60 to-transparent" />
                </div>

                {/* Floating card: AI Chat */}
                <div className="absolute -left-12 top-1/3 bg-white rounded-2xl shadow-2xl shadow-blue-200 p-4 w-52 border border-blue-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <MessageSquareIcon className="size-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">AI Đang Tư Vấn</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[0, 0.15, 0.3].map((d, i) => (
                          <div key={i} className="size-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    "Triệu chứng của bạn có thể là răng nhạy cảm..."
                  </p>
                </div>

                {/* Floating card: Booking */}
                <div className="absolute -right-10 bottom-1/4 bg-white rounded-2xl shadow-2xl shadow-blue-200 p-4 w-48 border border-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                      <CalendarIcon className="size-4 text-white" />
                    </div>
                    <p className="text-xs font-black text-slate-800">Đặt lịch thành công!</p>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Thứ 6, 9:00 AM<br />BS. Nguyễn Minh Tú</p>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-600">Đã xác nhận</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 group">
                <div className="size-10 bg-white/15 rounded-xl flex items-center justify-center group-hover:bg-white/25 transition-colors shrink-0">
                  <Icon className="size-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-black text-white leading-none">{value}</div>
                  <div className="text-xs text-blue-200 font-medium mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="relative z-10 leading-none -mb-1">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z" fill="#ffffff"/>
        </svg>
      </div>
    </section>
  );
}

export default Hero;
