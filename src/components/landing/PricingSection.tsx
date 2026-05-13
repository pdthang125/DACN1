import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Cơ bản",
    price: "0đ",
    period: "/tháng",
    desc: "Dành cho khách hàng mới trải nghiệm",
    cta: "Bắt đầu miễn phí",
    featured: false,
    features: [
      "Đặt lịch khám không giới hạn",
      "Tìm kiếm bác sĩ theo khu vực",
      "Tư vấn AI cơ bản (5 câu/ngày)",
      "Nhắc lịch hẹn qua email",
      "Xem lịch sử khám bệnh",
    ],
  },
  {
    name: "AI Premium",
    price: "199.000đ",
    period: "/tháng",
    desc: "Tối ưu cho hành trình chăm sóc nụ cười",
    cta: "Nâng cấp ngay",
    featured: true,
    features: [
      "Tất cả tính năng gói Cơ bản",
      "Tư vấn AI không giới hạn 24/7",
      "Phân tích phim X-quang bằng AI",
      "Phác đồ chăm sóc cá nhân hóa",
      "Ưu tiên đặt lịch bác sĩ giỏi",
      "Hỗ trợ ưu tiên 24/7",
    ],
  },
  {
    name: "Family",
    price: "399.000đ",
    period: "/tháng",
    desc: "Chăm sóc trọn vẹn cho cả gia đình (4 người)",
    cta: "Chọn gói Family",
    featured: false,
    features: [
      "Premium cho 4 thành viên",
      "Quản lý lịch hẹn gia đình",
      "Cảnh báo sức khỏe nhi khoa",
      "Báo cáo tổng hợp hàng tháng",
      "Tư vấn video với bác sĩ",
    ],
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 px-6 bg-gradient-to-b from-slate-50 to-blue-50 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#dbeafe_0%,transparent_60%)] opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 border border-blue-200 rounded-full text-xs font-black uppercase tracking-widest text-blue-700 mb-5">
            Bảng giá dịch vụ
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-5">
            Chọn gói{" "}
            <span className="text-blue-600">phù hợp với bạn</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Miễn phí đặt lịch khám. Nâng cấp để dùng AI không giới hạn và nhận phác đồ chăm sóc cá nhân hóa.
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative group flex flex-col rounded-3xl transition-all duration-400 ${
                plan.featured
                  ? "bg-gradient-to-b from-blue-700 to-blue-800 shadow-2xl shadow-blue-300 scale-[1.04] z-10 border-2 border-blue-500"
                  : "bg-white border border-slate-200 hover:border-blue-200 shadow-md hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg whitespace-nowrap">
                    <Crown className="size-3 fill-white" />
                    Phổ biến nhất
                  </div>
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                {/* Plan header */}
                <div className="mb-8">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold mb-4 ${
                    plan.featured ? "bg-white/15 text-blue-100" : "bg-blue-50 text-blue-600"
                  }`}>
                    <Zap className="size-3" />
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-black ${plan.featured ? "text-white" : "text-slate-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`font-medium ${plan.featured ? "text-blue-200" : "text-slate-400"}`}>{plan.period}</span>
                  </div>
                  <p className={`text-sm font-medium ${plan.featured ? "text-blue-200" : "text-slate-500"}`}>{plan.desc}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle2 className={`size-5 mt-0.5 shrink-0 ${plan.featured ? "text-blue-300" : "text-blue-500"}`} />
                      <span className={`text-sm font-medium ${plan.featured ? "text-blue-100" : "text-slate-600"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <SignUpButton mode="modal">
                  <Button
                    className={`w-full h-12 rounded-2xl font-bold text-sm transition-all ${
                      plan.featured
                        ? "bg-white text-blue-700 hover:bg-blue-50 shadow-xl hover:-translate-y-0.5"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </SignUpButton>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-sm text-slate-400 font-medium">
          * Giá đã bao gồm VAT • Hủy gói bất cứ lúc nào • Không ràng buộc hợp đồng
        </p>
      </div>
    </section>
  );
}

export default PricingSection;
