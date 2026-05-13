import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { MessageSquareIcon, CalendarIcon, MicIcon, StarIcon, CheckCircleIcon, ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MainActions() {
  const actions = [
    {
      title: "Trợ lý Trí tuệ Nhân tạo",
      desc: "Tư vấn nha khoa tức thì, phân tích triệu chứng qua giọng nói 24/7.",
      icon: MicIcon,
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/voice",
      cta: "Bắt đầu Trò chuyện",
      benefits: ["Hỗ trợ 24/7 không nghỉ", "Tư vấn chuyên sâu", "Giải đáp khẩn cấp"],
    },
    {
      title: "Đặt Lịch Khám",
      desc: "Lựa chọn bác sĩ giỏi, khung giờ phù hợp và dịch vụ nha khoa tốt nhất.",
      icon: CalendarIcon,
      color: "bg-emerald-600",
      lightColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      href: "/appointments",
      cta: "Đặt lịch ngay",
      benefits: ["Đội ngũ bác sĩ đầu ngành", "Xác nhận tức thì", "Nhắc lịch tự động"],
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-16">
      {actions.map((action) => (
        <div key={action.title} className="group relative">
          <Card className="h-full relative overflow-hidden rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-1">
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${action.lightColor} to-transparent`} />
            
            <CardContent className="relative p-8 md:p-10 space-y-8">
              <div className="flex items-start justify-between">
                <div className={`size-16 ${action.lightColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <action.icon className={`size-8 ${action.iconColor}`} />
                </div>
                <div className="size-8 bg-slate-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                   <ArrowRightIcon className="size-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{action.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{action.desc}</p>
              </div>

              <div className="space-y-3">
                {action.benefits.map((b) => (
                  <div key={b} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <CheckCircleIcon className={`size-4 ${action.iconColor}`} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <Link
                href={action.href}
                className={buttonVariants({
                  variant: "default",
                  className: `w-full h-14 rounded-2xl ${action.color} text-white font-black text-base shadow-xl shadow-blue-200 transition-all hover:shadow-2xl hover:-translate-y-0.5`,
                })}
              >
                {action.cta}
              </Link>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
