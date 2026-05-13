import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

interface Message {
  role: string;
  content: string;
}

interface Doctor {
  id: string;
  name: string;
  speciality: string;
}

// Tìm kết quả action gần nhất trong lịch sử hội thoại
function findLastActionResult(messages: Message[]): { action: string; data: unknown } | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "user" && msg.content.startsWith("[KẾT QUẢ HỆ THỐNG")) {
      const jsonStr = msg.content.replace("[KẾT QUẢ HỆ THỐNG - không hiển thị cho khách]: ", "");
      try {
        const data = JSON.parse(jsonStr);
        if (Array.isArray(data) && data.length > 0 && "speciality" in data[0]) return { action: "getDoctors", data };
        if (data && "availableSlots" in data) return { action: "getAvailableSlots", data };
        if (data && "doctorName" in data && "time" in data) return { action: "bookAppointment", data };
        if (Array.isArray(data) && (data.length === 0 || (data[0] && "doctorName" in data[0]))) return { action: "getMyAppointments", data };
      } catch { /* ignore */ }
    }
  }
  return null;
}

// Tìm danh sách bác sĩ trong lịch sử (để map khi user chọn)
function findDoctorsFromHistory(messages: Message[]): Doctor[] | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "user" && msg.content.startsWith("[KẾT QUẢ HỆ THỐNG")) {
      const jsonStr = msg.content.replace("[KẾT QUẢ HỆ THỐNG - không hiển thị cho khách]: ", "");
      try {
        const data = JSON.parse(jsonStr);
        if (Array.isArray(data) && data.length > 0 && "speciality" in data[0]) return data as Doctor[];
      } catch { /* ignore */ }
    }
  }
  return null;
}

// Tìm context booking (doctorId, date đã chọn) từ lịch sử
function findBookingContext(messages: Message[]): { doctorId?: string; doctorName?: string; date?: string } {
  const ctx: { doctorId?: string; doctorName?: string; date?: string } = {};
  for (const msg of messages) {
    const slotMatch = msg.content.match(/getAvailableSlots.*?"doctorId"\s*:\s*"([^"]+)".*?"date"\s*:\s*"([^"]+)"/s);
    if (slotMatch) { ctx.doctorId = slotMatch[1]; ctx.date = slotMatch[2]; }
    const nameMatch = msg.content.match(/getAvailableSlots.*?"doctorName"\s*:\s*"([^"]+)"/s);
    if (nameMatch) ctx.doctorName = nameMatch[1];
  }
  return ctx;
}

// Parse ngày từ text
function parseDate(text: string): string | null {
  const iso = text.match(/(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const vn = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (vn) return `${vn[3]}-${vn[2].padStart(2,"0")}-${vn[1].padStart(2,"0")}`;
  const vn2 = text.match(/(\d{1,2})\s*(?:tháng)\s*(\d{1,2})(?:\s*(?:năm)?\s*(\d{4}))?/);
  if (vn2) return `${vn2[3]||"2026"}-${vn2[2].padStart(2,"0")}-${vn2[1].padStart(2,"0")}`;
  if (/ngày mai|tomorrow/.test(text)) {
    const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split("T")[0];
  }
  return null;
}

// Parse giờ từ text
function parseTime(text: string): string | null {
  const t = text.match(/(\d{1,2}):(\d{2})/);
  if (t) return `${t[1].padStart(2,"0")}:${t[2]}`;
  const h = text.match(/(\d{1,2})\s*(?:giờ|h)\b/);
  if (h) return `${h[1].padStart(2,"0")}:00`;
  return null;
}

// Detect intent
function detectIntent(text: string): string {
  const t = text.toLowerCase();
  if (/^(xin chào|chào|hello|hi\b|hey)/.test(t)) return "greeting";
  if (/giá|bảng giá|chi phí|bao nhiêu|phí|fee/.test(t)) return "price";
  if (/đặt lịch|đặt hẹn|muốn khám|cần khám|book|hẹn khám|lịch khám|đăng ký/.test(t)) return "book";
  if (/lịch hẹn của|xem lịch|lịch của tôi|kiểm tra lịch/.test(t)) return "my_appointments";
  if (/bác sĩ nào|danh sách bác sĩ|có bác sĩ/.test(t)) return "doctors";
  if (/giờ làm|mở cửa|thời gian|opening/.test(t)) return "hours";
  if (/dịch vụ|khám gì|cung cấp|loại hình/.test(t)) return "services";
  if (/địa chỉ|ở đâu|location/.test(t)) return "address";
  if (/cảm ơn|thank|cám ơn/.test(t)) return "thanks";
  if (/tạm biệt|bye|goodbye/.test(t)) return "bye";
  return "unknown";
}

// URL của Python server chạy model fine-tuned (serve.py)
const LOCAL_MODEL_URL = process.env.LOCAL_AI_URL || "http://localhost:8001";

// Gọi model local fine-tuned
async function callLocalModel(messages: Message[]): Promise<string | null> {
  try {
    const res = await fetch(`${LOCAL_MODEL_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: AbortSignal.timeout(15000), // timeout 15s
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.reply || null;
  } catch {
    return null; // Server chưa chạy → fallback rule-based
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: Message[] };
    const userText = messages[messages.length - 1]?.content || "";
    const lastResult = findLastActionResult(messages);

    // Chỉ xử lý action result khi tin nhắn CUỐI CÙNG là system message
    // (tức là widget vừa gọi xong action và gọi lại AI để xử lý kết quả)
    const lastMsg = messages[messages.length - 1];
    const isSystemResult = lastMsg?.content.startsWith("[KẾT QUẢ HỆ THỐNG");

    // === XỬ LÝ KẾT QUẢ TỪ DATABASE (sau khi widget gọi action) ===

    if (isSystemResult && lastResult?.action === "getDoctors") {
      const doctors = lastResult.data as Doctor[];
      if (!doctors.length) return NextResponse.json({ reply: "Dạ, hiện tại phòng khám chưa có bác sĩ nào đang hoạt động ạ!" });
      const list = doctors.map((d, i) => `${i+1}. 👨‍⚕️ **${d.name}** — ${d.speciality}`).join("\n");
      return NextResponse.json({ reply: `Dạ, đây là danh sách bác sĩ hiện có ạ:\n\n${list}\n\nAnh/Chị muốn chọn bác sĩ nào và ngày nào ạ? (VD: "Bác sĩ 1, ngày 15/05")` });
    }

    if (isSystemResult && lastResult?.action === "getAvailableSlots") {
      const d = lastResult.data as { availableSlots: string[] };
      if (!d.availableSlots.length) return NextResponse.json({ reply: "Dạ, ngày này bác sĩ đã kín lịch rồi ạ. Anh/Chị muốn chọn ngày khác không?" });
      return NextResponse.json({ reply: `Dạ, các khung giờ còn trống:\n\n⏰ ${d.availableSlots.join("  |  ")}\n\nAnh/Chị muốn đặt giờ nào ạ?` });
    }

    if (isSystemResult && lastResult?.action === "bookAppointment") {
      const a = lastResult.data as { doctorName: string; date: string; time: string; reason: string };
      return NextResponse.json({ reply: `✅ **Đặt lịch thành công!**\n\n👨‍⚕️ Bác sĩ: **${a.doctorName}**\n📅 Ngày: **${a.date}**\n⏰ Giờ: **${a.time}**\n📋 Lý do: **${a.reason}**\n\nNha khoa SmileCare đã ghi nhận lịch hẹn của Anh/Chị! Nhớ đến đúng giờ nhé! 😊` });
    }

    if (isSystemResult && lastResult?.action === "getMyAppointments") {
      const appts = lastResult.data as Array<{ doctorName: string; date: string; time: string; status: string }>;
      if (!appts.length) return NextResponse.json({ reply: "Dạ, Anh/Chị chưa có lịch hẹn nào ạ. Anh/Chị có muốn đặt lịch không?" });
      const list = appts.map((a, i) => `${i+1}. 📅 ${a.date} ${a.time} — ${a.doctorName} [${a.status}]`).join("\n");
      return NextResponse.json({ reply: `Dạ, lịch hẹn của Anh/Chị:\n\n${list}\n\nAnh/Chị cần hỗ trợ gì thêm không ạ?` });
    }

    // === XỬ LÝ TIN NHẮN THƯỜNG TRONG LUỒNG BOOKING ===

    // Nếu đang chờ chọn bác sĩ + ngày (vừa hiển thị danh sách bác sĩ)
    const doctors = findDoctorsFromHistory(messages);
    const prevAssistant = [...messages].reverse().find(m => m.role === "model" && m.content.includes("danh sách bác sĩ"));
    if (doctors && prevAssistant) {
      const date = parseDate(userText);
      let selectedDoctor: Doctor | null = null;
      const lower = userText.toLowerCase();
      // Tìm bác sĩ theo số thứ tự hoặc tên
      for (let i = 0; i < doctors.length; i++) {
        if (lower.includes(String(i+1)) || lower.includes(doctors[i].name.toLowerCase())) {
          selectedDoctor = doctors[i]; break;
        }
      }
      if (selectedDoctor && date) {
        return NextResponse.json({ reply: `Dạ, em kiểm tra lịch trống của Bác sĩ **${selectedDoctor.name}** ngày **${date}** nhé!\n[ACTION]{"action":"getAvailableSlots","params":{"doctorId":"${selectedDoctor.id}","date":"${date}"}}[/ACTION]` });
      }
      if (selectedDoctor && !date) {
        return NextResponse.json({ reply: `Dạ, Anh/Chị muốn khám với Bác sĩ **${selectedDoctor.name}** ạ! Anh/Chị muốn khám vào ngày nào? (VD: 15/05/2026 hoặc ngày mai)` });
      }
    }

    // Nếu đang chờ chọn giờ (vừa hiển thị slot)
    const prevSlotMsg = [...messages].reverse().find(m => m.role === "model" && m.content.includes("khung giờ còn trống"));
    if (prevSlotMsg) {
      const time = parseTime(userText);
      if (time) {
        const ctx = findBookingContext(messages);
        const reason = "Khám Tổng Quát";
        if (ctx.doctorId) {
          return NextResponse.json({ reply: `Dạ, em đặt lịch cho Anh/Chị lúc **${time}** nhé!\n[ACTION]{"action":"bookAppointment","params":{"doctorId":"${ctx.doctorId}","date":"${ctx.date}","time":"${time}","reason":"${reason}"}}[/ACTION]` });
        }
      }
      return NextResponse.json({ reply: `Dạ, Anh/Chị vui lòng nhập giờ cụ thể nhé! (VD: 9:00, 10:30, 14:00)` });
    }

    // === XỬ LÝ INTENT THÔNG THƯỜNG ===
    const intent = detectIntent(userText);

    const responses: Record<string, string> = {
      greeting: `Dạ, xin chào Anh/Chị! 😊 Em là lễ tân AI của **Nha khoa SmileCare** 🦷\n\nEm có thể giúp:\n• 💰 Tư vấn bảng giá\n• 📅 Đặt lịch khám\n• 👨‍⚕️ Xem danh sách bác sĩ\n• 📋 Kiểm tra lịch hẹn\n\nAnh/Chị cần gì ạ?`,
      price: `Dạ, **Bảng giá dịch vụ** Nha khoa SmileCare:\n\n• 🔍 Khám tổng quát & Tư vấn: **Miễn phí**\n• 🦷 Cạo vôi răng: **300.000 VNĐ**\n• 🔧 Nhổ răng khôn (mọc thẳng): **1.000.000 VNĐ**\n• 🔧 Nhổ răng khôn (mọc ngầm): **2.500.000 VNĐ**\n• ✨ Tẩy trắng Laser: **2.000.000 VNĐ**\n• 👑 Bọc răng sứ: **3.000.000 - 8.000.000 VNĐ/răng**\n• 📎 Niềng răng mắc cài: **30.000.000 VNĐ/trọn gói**\n\nAnh/Chị quan tâm đến dịch vụ nào ạ?`,
      hours: `🕗 Nha khoa SmileCare làm việc:\n\n**8:00 Sáng — 8:00 Tối**\n📅 **Tất cả các ngày trong tuần**\n\nAnh/Chị có muốn đặt lịch không ạ?`,
      address: `📍 **123 Đường ABC, Quận 1, TP.HCM**\n🕗 Giờ làm việc: 8:00 - 20:00 mỗi ngày\n\nAnh/Chị có muốn đặt lịch hẹn không ạ?`,
      services: `Dạ, Nha khoa SmileCare cung cấp:\n\n1. 🔍 Khám Tổng Quát (60 phút)\n2. 🦷 Cạo Vôi Răng (45 phút)\n3. 💬 Tư Vấn (30 phút - Miễn phí)\n4. 🚨 Khám Cấp Cứu (30 phút)\n5. ✨ Tẩy trắng răng Laser\n6. 👑 Bọc răng sứ thẩm mỹ\n7. 📎 Niềng răng mắc cài\n\nAnh/Chị muốn đặt lịch không ạ?`,
      doctors: `Dạ, để xem danh sách bác sĩ, em tra hệ thống ngay nhé!\n[ACTION]{"action":"getDoctors"}[/ACTION]`,
      book: `Dạ, em sẽ giúp Anh/Chị đặt lịch! 📅 Em tra danh sách bác sĩ ngay nhé!\n[ACTION]{"action":"getDoctors"}[/ACTION]`,
      my_appointments: `Dạ, em kiểm tra lịch hẹn của Anh/Chị ngay!\n[ACTION]{"action":"getMyAppointments"}[/ACTION]`,
      thanks: `Dạ, không có gì ạ! 😊 Nha khoa SmileCare luôn sẵn sàng hỗ trợ Anh/Chị!`,
      bye: `Dạ, tạm biệt Anh/Chị! 👋 Chúc Anh/Chị sức khỏe thật tốt! 🦷✨`,
    };

    // Với các intent có sẵn câu trả lời cứng → trả về ngay
    if (responses[intent]) {
      return NextResponse.json({ reply: responses[intent] });
    }

    // Với câu hỏi tự do (unknown) → thử gọi model local fine-tuned
    const localReply = await callLocalModel(
      messages.filter(m => !m.content.startsWith("[KẾT QUẢ HỆ THỐNG"))
    );
    if (localReply) {
      return NextResponse.json({ reply: localReply });
    }

    // Fallback cuối cùng
    return NextResponse.json({ reply: `Dạ, em xin lỗi vì chưa hiểu ý Anh/Chị ạ. Em có thể giúp:\n• 💰 Bảng giá dịch vụ\n• 📅 Đặt lịch khám\n• 👨‍⚕️ Danh sách bác sĩ\n• 📋 Lịch hẹn của bạn\n• 📍 Địa chỉ & giờ làm việc` });
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ reply: "Dạ, hệ thống đang gặp sự cố. Anh/Chị thử lại sau nhé! 🙏" }, { status: 200 });
  }
}
