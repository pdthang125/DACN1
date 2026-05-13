import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, CalendarIcon, CheckCircle2, ArrowRightIcon } from "lucide-react";

const benefits = [
  "Tư vấn AI miễn phí, không giới hạn câu hỏi",
  "Đặt lịch trong 30 giây, xác nhận tức thì",
  "Kết nối 15+ bác sĩ chuyên khoa hàng đầu",
  "Nhắc lịch tự động, không bao giờ bỏ lỡ",
];

function CTA() {
  return (
    <section className="relative py-24 px-6 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#dbeafe_0%,transparent_70%)] opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main CTA card */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 shadow-2xl shadow-blue-200">
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          {/* Glow orbs */}
          <div className="absolute -top-20 -right-20 size-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-64 bg-sky-300/20 rounded-full blur-3xl" />

          <div className="relative z-10 p-10 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div className="space-y-6 text-white">
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 backdrop-blur-sm rounded-full px-4 py-1.5">
                  <span className="size-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white/90">Hỗ trợ 24/7 • Sẵn sàng ngay</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                  Bắt đầu hành trình
                  <br />
                  <span className="text-blue-200">chăm sóc nụ cười</span>
                  <br />
                  ngay hôm nay!
                </h2>

                <p className="text-blue-100 text-lg font-medium leading-relaxed max-w-md">
                  Hơn 1,500 bệnh nhân đã tin tưởng DentWise. Hãy để chúng tôi đồng hành cùng bạn trên hành trình sức khỏe răng miệng.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <SignUpButton mode="modal">
                    <Button
                      size="lg"
                      className="h-14 px-8 font-black text-base bg-white text-blue-700 hover:bg-blue-50 border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 rounded-2xl group"
                    >
                      <MessageSquareIcon className="mr-2 size-5 group-hover:scale-110 transition-transform" />
                      Chat AI miễn phí
                    </Button>
                  </SignUpButton>
                  <SignUpButton mode="modal">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 px-8 font-bold text-base border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60 rounded-2xl backdrop-blur-sm transition-all"
                    >
                      <CalendarIcon className="mr-2 size-5" />
                      Đặt lịch khám
                    </Button>
                  </SignUpButton>
                </div>
              </div>

              {/* Right: benefit checklist */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 space-y-4">
                <h3 className="text-white font-extrabold text-lg mb-6 flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-green-300" />
                  Tại sao chọn DentWise?
                </h3>
                {benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3 group">
                    <div className="size-6 rounded-lg bg-green-400/20 flex items-center justify-center shrink-0 group-hover:bg-green-400/30 transition-colors mt-0.5">
                      <CheckCircle2 className="size-3.5 text-green-300" />
                    </div>
                    <span className="text-blue-50 font-medium text-sm leading-relaxed">{b}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-white/10">
                  <a href="#pricing" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm font-bold transition-colors group">
                    Xem bảng giá chi tiết
                    <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
