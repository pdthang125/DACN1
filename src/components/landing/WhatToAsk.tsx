import { Sparkles, HeartPulse, BadgeDollarSign, Info, BotIcon, MessageCircle } from "lucide-react";
import Image from "next/image";

const chatExamples = [
  {
    icon: HeartPulse,
    label: "Triệu chứng đau",
    question: "Tôi bị đau răng khi uống nước lạnh, có phải sâu răng không?",
    answer: "AI phân tích nguyên nhân (men răng mòn, sâu răng hoặc tụt nướu), đề xuất cách giảm đau và mức độ khẩn cấp cần gặp bác sĩ.",
    tagColor: "bg-rose-100 text-rose-600",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    border: "hover:border-rose-200",
  },
  {
    icon: BadgeDollarSign,
    label: "Tư vấn chi phí",
    question: "Bọc răng sứ giá bao nhiêu và loại nào bền nhất?",
    answer: "So sánh sứ Zirconia, Emax, Cercon — giá, độ bền, thẩm mỹ và phác đồ chăm sóc dài hạn cho từng loại.",
    tagColor: "bg-blue-100 text-blue-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    border: "hover:border-blue-200",
  },
  {
    icon: Info,
    label: "Tư vấn nhi khoa",
    question: "Khi nào trẻ em nên đi khám răng lần đầu tiên?",
    answer: "Nên đưa bé đi khám khi mọc chiếc răng sữa đầu tiên (~6 tháng). SmileCare kết nối ngay bác sĩ nhi khoa gần bạn.",
    tagColor: "bg-emerald-100 text-emerald-600",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    border: "hover:border-emerald-200",
  },
];

function WhatToAsk() {
  return (
    <section id="features" className="relative py-24 px-6 bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#dbeafe_0%,transparent_50%)] opacity-60" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 border border-blue-200 rounded-full text-xs font-black uppercase tracking-widest text-blue-700 mb-5">
            Trợ lý AI Thông minh
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-5">
            Mọi câu hỏi nha khoa{" "}
            <span className="text-blue-600">đều có đáp án</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            AI SmileCare được huấn luyện chuyên sâu về nha khoa — giải đáp từ triệu chứng đơn giản đến vấn đề phức tạp trong tích tắc.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Chat examples */}
          <div className="space-y-4">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <MessageCircle className="size-4 text-blue-400" />
              Ví dụ câu hỏi thực tế
            </p>
            {chatExamples.map((item, idx) => (
              <div
                key={idx}
                className={`group bg-white rounded-2xl p-6 border border-slate-100 ${item.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer`}
              >
                <div className="flex items-start gap-4">
                  <div className={`size-10 ${item.iconBg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`size-5 ${item.iconColor}`} />
                  </div>
                  <div className="space-y-2 flex-1">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-md font-bold ${item.tagColor}`}>
                      {item.label}
                    </span>
                    <p className="font-bold text-slate-800 text-sm leading-snug">
                      "{item.question}"
                    </p>
                    <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
                      <BotIcon className="size-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Doctor image + floating UI */}
          <div className="relative">
            {/* Decorative blob */}
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-sky-100 rounded-[3rem] blur-2xl opacity-60" />

            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-blue-100">
              <Image
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop"
                alt="Bác sĩ nha khoa SmileCare"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
              {/* Bottom overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent" />

              {/* AI Typing card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-4 shadow-2xl border border-blue-50">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <BotIcon className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-black text-slate-800">Trợ lý AI SmileCare</p>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Trực tuyến
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[0, 0.15, 0.3].map((d, i) => (
                        <div
                          key={i}
                          className="size-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${d}s` }}
                        />
                      ))}
                      <span className="text-xs text-slate-400 ml-1 font-medium">Đang phân tích...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-blue-50">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Sparkles className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900">10,000+</p>
                  <p className="text-xs text-slate-500 font-medium">câu hỏi đã giải đáp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatToAsk;
