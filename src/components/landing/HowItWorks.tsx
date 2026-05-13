import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, MessageCircle, CalendarCheck, ShieldCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Tư vấn với AI 24/7",
    description: "Hỏi bất kỳ câu nào về răng miệng — AI DentWise phân tích triệu chứng, giải thích nguyên nhân và đề xuất hướng xử lý tức thì, mọi lúc mọi nơi.",
    accent: "bg-blue-600",
    lightBg: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-100",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Chọn bác sĩ phù hợp",
    description: "Hệ thống gợi ý bác sĩ chuyên khoa theo tình trạng và địa điểm. Xem hồ sơ, chuyên môn và đánh giá từ bệnh nhân thực tế một cách minh bạch.",
    accent: "bg-sky-500",
    lightBg: "bg-sky-50",
    textColor: "text-sky-600",
    borderColor: "border-sky-100",
    gradient: "from-sky-400 to-sky-600",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Đặt lịch & Hoàn tất",
    description: "Xác nhận lịch hẹn online chỉ trong vài chạm. Nhận thông báo nhắc lịch tự động và đến phòng khám tận hưởng dịch vụ 5 sao từ DentWise.",
    accent: "bg-indigo-600",
    lightBg: "bg-indigo-50",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-100",
    gradient: "from-indigo-500 to-indigo-700",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 px-6 bg-white overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#dbeafe_0%,transparent_70%)] opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-black uppercase tracking-widest text-blue-600 mb-5">
            Quy trình đơn giản
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-5">
            Chỉ cần{" "}
            <span className="relative">
              <span className="text-blue-600">3 bước đơn giản</span>
              <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 100 4">
                <rect width="100" height="4" rx="2" fill="#bfdbfe"/>
              </svg>
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            DentWise giúp bạn đi từ lo lắng đến an tâm nhanh nhất có thể — AI tư vấn, bác sĩ đồng hành.
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* Dashed connector */}
          <div className="hidden lg:block absolute top-16 left-1/3 right-1/3 h-px border-t-2 border-dashed border-blue-200 z-0" />

          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`group relative bg-white rounded-3xl p-8 border ${step.borderColor} shadow-sm 
                hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-2 transition-all duration-400 cursor-pointer`}
            >
              {/* Number badge */}
              <div className={`absolute -top-4 left-8 size-10 bg-gradient-to-br ${step.gradient} text-white rounded-2xl flex items-center justify-center text-sm font-black shadow-lg group-hover:scale-110 transition-transform`}>
                {step.number}
              </div>

              {/* Icon container */}
              <div className={`${step.lightBg} size-16 rounded-2xl flex items-center justify-center mb-6 mt-4 group-hover:scale-105 transition-transform duration-300`}>
                <step.icon className={`size-8 ${step.textColor}`} />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{step.description}</p>

              {/* Hover indicator */}
              <div className={`mt-6 flex items-center gap-2 ${step.textColor} text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity`}>
                Tìm hiểu thêm <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-sky-500 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200">
          <div className="text-white text-center md:text-left">
            <h3 className="text-2xl font-extrabold mb-1">Sẵn sàng bắt đầu hành trình?</h3>
            <p className="text-blue-100 font-medium">Đăng ký miễn phí — không cần thẻ tín dụng</p>
          </div>
          <SignUpButton mode="modal">
            <Button className="shrink-0 bg-white text-blue-700 hover:bg-blue-50 font-black px-8 h-12 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group">
              Bắt đầu ngay hôm nay
              <ArrowRightIcon className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
