import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

// ============================================================
// SYSTEM PROMPT
// ============================================================
const SYSTEM_PROMPT = [
  "Ban la SmileCare AI - tro ly nha khoa thong minh cua Nha khoa DentWise.",
  "Ban noi tieng Viet, xung 'Em', goi khach la 'Anh/Chi', than thien va ngan gon.",
  "",
  "PHAM VI HO TRO (chi tra loi cac chu de sau):",
  "- Tu van dich vu nha khoa (kham, tram, nho, nieng, boc su, lay cao rang, tay trang, cay ghep implant...)",
  "- Bang gia dich vu tai DentWise",
  "- Trieu chung va tinh trang rang mieng (dau rang, e buot, sau rang, viem nuou...)",
  "- Huong dan cham soc rang mieng hang ngay",
  "- Thong tin phong kham (dia chi, gio lam viec, lien he)",
  "- Thong tin bac si (ten, chuyen khoa)",
  "- Phan tich anh rang / phim X-quang neu nguoi dung gui anh len",
  "",
  "THONG TIN PHONG KHAM DENTWISE:",
  "- Dia chi: 123 Duong ABC, Quan 1, TP.HCM",
  "- Gio lam viec: 8:00 - 20:00, tat ca cac ngay trong tuan ke ca Thu 7 va Chu Nhat",
  "- Dien thoai: 1800-xxxx",
  "",
  "BANG GIA DICH VU:",
  "- Kham tong quat & Tu van: Mien phi",
  "- Lay cao rang: 300.000 VND",
  "- Tram rang: 300.000 - 700.000 VND/rang",
  "- Nho rang khon moc thang: 1.000.000 VND",
  "- Nho rang khon moc ngam/lech: 2.500.000 VND",
  "- Tay trang rang Laser: 2.000.000 VND",
  "- Boc rang su tham my: 3.000.000 - 8.000.000 VND/rang",
  "- Nieng rang mac cai kim loai: 30.000.000 VND/tron goi",
  "- Cay ghep Implant: Lien he bac si de bao gia chi tiet",
  "",
  "DANH SACH BAC SI:",
  "- BS. Hoang Trong Nang: Chuyen khoa Nho rang",
  "- BS. Le Hoang Nam: Chuyen khoa Nha tong quat",
  "- BS. Nguyen Minh Minh: Chuyen khoa Chinh nha (nieng rang)",
  "- BS. Nguyen Nam Minh: Chuyen khoa Chinh nha (nieng rang)",
  "- BS. Pham Thu Ha: Chuyen khoa Rang su tham my",
  "- BS. Tran Quoc Bao: Chuyen khoa Implant",
  "",
  "QUY TAC TRA LOI BAT BUOC:",
  "- KHONG bao gio dat lich, tra cuu lich, hay thu thap thong tin ca nhan (SĐT, ngay gio) qua chatbox",
  "- Neu khach muon dat lich: huong dan ho nhan vao nut 'Lich hen' tren thanh menu",
  "- KHONG su dung bat ky ACTION nao",
  "- KHONG them cau xin loi hay thong bao loi he thong vao cuoi cau tra loi",
  "- Tra loi truc tiep, ngan gon, dung emoji phu hop, de doc tren mobile",
  "- Neu nguoi dung hoi ngoai chu de nha khoa, tu choi ngan gon 1 cau",
].join("\n");

// ============================================================
// Fallback rule-based (khi AI khong kha dung)
// ============================================================
function detectIntent(text: string): string {
  const t = text.toLowerCase();
  if (/^(xin chào|chào|hello|hi\b|hey|alo)/.test(t)) return "greeting";
  if (/giá|bảng giá|chi phí|bao nhiêu|phí|tiền/.test(t)) return "price";
  if (/đặt lịch|đặt hẹn|muốn khám|cần khám|book|hẹn|lịch khám|đăng ký/.test(t)) return "book";
  if (/bác sĩ|danh sách bác sĩ|có bác sĩ|tìm bác sĩ|chuyên khoa/.test(t)) return "doctors";
  if (/giờ làm|mở cửa|thời gian|làm việc mấy giờ/.test(t)) return "hours";
  if (/dịch vụ|khám gì|cung cấp|loại hình/.test(t)) return "services";
  if (/địa chỉ|ở đâu|location|chỗ nào/.test(t)) return "address";
  if (/cảm ơn|thank|cám ơn/.test(t)) return "thanks";
  return "unknown";
}

function getRuleBasedReply(userText: string): string {
  const intent = detectIntent(userText);
  const responses: Record<string, string> = {
    greeting: "Da, xin chao Anh/Chi! Em la tro ly AI cua Nha khoa DentWise. Em co the tu van bang gia, thong tin bac si, benh ly rang mieng va phan tich anh rang. Anh/Chi can ho tro gi a?",
    price: "Da, Bang gia dich vu Nha khoa DentWise:\n\n• Kham tong quat & Tu van: Mien phi\n• Lay cao rang: 300.000 VND\n• Tram rang: 300.000 - 700.000 VND/rang\n• Nho rang khon (thang): 1.000.000 VND\n• Nho rang khon (ngam): 2.500.000 VND\n• Tay trang Laser: 2.000.000 VND\n• Boc rang su: 3.000.000 - 8.000.000 VND/rang\n• Nieng rang mac cai: 30.000.000 VND/tron goi\n\nAnh/Chi quan tam den dich vu nao a?",
    hours: "Nha khoa DentWise lam viec 8:00 - 20:00, tat ca cac ngay ke ca Thu 7 va Chu Nhat. De dat lich, Anh/Chi vui long chon muc Lich hen tren menu a!",
    address: "Dia chi: 123 Duong ABC, Quan 1, TP.HCM. Gio lam viec: 8:00 - 20:00 moi ngay. Hotline: 1800-xxxx.",
    services: "Nha khoa DentWise cung cap: Kham tong quat, Lay cao rang, Tram rang, Kham cap cuu, Tay trang Laser, Boc rang su, Nieng rang, Cay ghep Implant. Anh/Chi can tu van them khong?",
    doctors: "Da, doi ngu bac si cua DentWise:\n\n• BS. Hoang Trong Nang - Nho rang\n• BS. Le Hoang Nam - Nha tong quat\n• BS. Nguyen Minh Minh - Chinh nha\n• BS. Nguyen Nam Minh - Chinh nha\n• BS. Pham Thu Ha - Rang su tham my\n• BS. Tran Quoc Bao - Implant\n\nAnh/Chi muon biet them ve bac si nao a?",
    book: "Da, de dat lich chinh xac va chon bac si mong muon, Anh/Chi vui long nhan vao muc Lich hen tren thanh menu nhe! He thong se hien thi day du gio trong a.",
    thanks: "Da, khong co gi a! Nha khoa DentWise luon san sang ho tro Anh/Chi!",
    unknown: "Da, em co the tu van ve: Bang gia dich vu, Thong tin bac si, Benh ly rang mieng, Phan tich anh rang. De dat lich, Anh/Chi vui long dung trang Lich hen nhe. Anh/Chi can ho tro gi a?",
  };
  return responses[intent] || responses.unknown;
}

// ============================================================
// Goi Groq API
// ============================================================
async function callGroq(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Groq] Error:", res.status, err.slice(0, 200));
      return null;
    }

    const data = await res.json() as {
      choices: Array<{ message: { content: string } }>;
    };
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("[Groq] Fetch error:", err);
    return null;
  }
}

// ============================================================
// POST handler
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as {
      messages: Array<{ role: string; content: string }>;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ reply: "Da, Anh/Chi co the hoi gi khong a?" });
    }

    // Chuyen doi role cho Groq
    const groqMessages = messages.map((m) => ({
      role: (m.role === "model" || m.role === "assistant") ? "assistant" as const : "user" as const,
      content: m.content,
    }));

    // === Thu Groq ===
    const groqReply = await callGroq(groqMessages);
    if (groqReply) {
      return NextResponse.json({ reply: groqReply });
    }

    // === Fallback rule-based neu Groq khong kha dung ===
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    const fallback = getRuleBasedReply(lastUserMsg?.content || "");
    return NextResponse.json({ reply: fallback });

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({
      reply: "Da, he thong dang gap su co nho. Anh/Chi vui long thu lai sau nhe!",
    });
  }
}
