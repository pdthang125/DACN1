"use client";

import { MessageCircleIcon, XIcon, SendIcon, BotIcon, UserIcon, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Hàm kiểm tra xem phản hồi AI có chứa lệnh ACTION không
function extractAction(text: string): { action: string; params?: Record<string, string> } | null {
  const match = text.match(/\[ACTION\](.*?)\[\/ACTION\]/s);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

// Hàm xoá thẻ ACTION khỏi nội dung hiển thị
function cleanActionTags(text: string): string {
  return text.replace(/\[ACTION\].*?\[\/ACTION\]/gs, "").trim();
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Đang xử lý...");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Hàm gọi API chat
  const callChatAPI = useCallback(async (chatMessages: ChatMessage[]): Promise<string> => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: chatMessages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          content: m.content,
        })),
      }),
    });
    const data = await res.json();
    return data.reply || "Dạ, em xin lỗi. Em chưa hiểu câu hỏi ạ.";
  }, []);

  // Hàm gọi API actions (truy vấn database)
  const callActionAPI = useCallback(async (actionData: { action: string; params?: Record<string, string> }): Promise<string> => {
    try {
      const res = await fetch("/api/chat/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actionData),
      });
      const data = await res.json();
      if (data.success) {
        return JSON.stringify(data.data);
      } else {
        return `Lỗi: ${data.error}`;
      }
    } catch {
      return "Lỗi: Không thể kết nối đến hệ thống.";
    }
  }, []);

  // Hàm xử lý gửi tin nhắn (bao gồm vòng lặp ACTION)
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Thêm tin nhắn của người dùng
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      let currentMessages = [...updatedMessages];
      let maxLoops = 5; // Đủ cho luồng đặt lịch nhiều bước

      while (maxLoops > 0) {
        setLoadingText("AI đang soạn trả lời...");
        // Gọi AI
        const aiReply = await callChatAPI(currentMessages);

        // Kiểm tra xem AI có yêu cầu thực hiện ACTION không
        const actionData = extractAction(aiReply);

        if (actionData) {
          // Cập nhật loading text theo từng loại action
          const actionLabels: Record<string, string> = {
            getDoctors: "Đang tải danh sách bác sĩ...",
            getAvailableSlots: "Đang kiểm tra lịch trống...",
            bookAppointment: "Đang đặt lịch cho bạn...",
            getMyAppointments: "Đang tải lịch hẹn của bạn...",
          };
          setLoadingText(actionLabels[actionData.action] || "Đang xử lý...");

          // AI muốn truy vấn database → Gọi action API
          const actionResult = await callActionAPI(actionData);

          // Thêm phản hồi AI (đã lọc ACTION) vào lịch sử nếu có text ngoài action
          const cleanReply = cleanActionTags(aiReply);
          if (cleanReply) {
            const partialMsg: ChatMessage = {
              id: (Date.now() + Math.random()).toString(),
              role: "assistant",
              content: cleanReply,
            };
            currentMessages = [...currentMessages, partialMsg];
            setMessages([...currentMessages]);
          }

          // Chèn kết quả action vào lịch sử để AI đọc tiếp
          const resultMsg: ChatMessage = {
            id: (Date.now() + Math.random()).toString(),
            role: "user",
            content: `[KẾT QUẢ HỆ THỐNG - không hiển thị cho khách]: ${actionResult}`,
          };
          currentMessages = [...currentMessages, resultMsg];

          maxLoops--;
        } else {
          // Không có ACTION → Hiển thị phản hồi bình thường
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: aiReply,
          };
          setMessages((prev) => [...prev, aiMessage]);
          break;
        }
      }
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Dạ, em xin lỗi. Hệ thống đang gặp trục trặc, Anh/Chị thử lại sau nhé! 🙏",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingText("Đang xử lý...");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="mb-4 bg-white border border-border/40 shadow-2xl rounded-[2rem] w-[350px] sm:w-[400px] h-[550px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          {/* Header */}
          <div className="bg-primary px-6 py-5 flex items-center justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="size-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30">
                  <BotIcon className="size-6 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 border-2 border-primary rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Trợ lý SmileCare</h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Trực tuyến</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-xl relative z-10"
              onClick={() => setIsOpen(false)}
            >
              <XIcon className="size-5" />
            </Button>
          </div>

          {/* Vùng hiển thị tin nhắn */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-primary/5 to-transparent custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-white size-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary/5 border border-primary/10">
                  <Sparkles className="size-8 text-primary animate-pulse" />
                </div>
                <h4 className="font-bold text-foreground mb-2">Xin chào! 👋</h4>
                <p className="text-sm text-muted-foreground px-8 font-medium">
                  Em là trợ lý AI của SmileCare. Rất vui được hỗ trợ Anh/Chị về các vấn đề nha khoa.
                </p>
                
                <div className="mt-8 grid grid-cols-1 gap-2 px-4">
                  {[
                    "💰 Tư vấn bảng giá dịch vụ",
                    "👨‍⚕️ Tìm bác sĩ chuyên khoa",
                    "📅 Đặt lịch khám nhanh",
                  ].map((text, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(text.slice(3))}
                      className="text-left px-4 py-3 bg-white hover:bg-primary hover:text-white transition-all rounded-xl text-xs font-bold border border-border/50 shadow-sm shadow-primary/5 group"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages
                .filter((m) => !m.content.startsWith("[KẾT QUẢ HỆ THỐNG"))
                .map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`size-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${
                      m.role === "user" 
                      ? "bg-white border-primary/20 text-primary" 
                      : "bg-primary border-primary text-white"
                    }`}
                  >
                    {m.role === "user" ? <UserIcon className="size-4.5" /> : <BotIcon className="size-4.5" />}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[82%] text-sm font-medium leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white text-foreground border border-border/50 rounded-tl-none"
                    }`}
                  >
                    {m.content.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < m.content.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3 flex-row animate-in fade-in duration-300">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
                   <BotIcon className="size-4.5 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-border/50 rounded-tl-none flex flex-col gap-2 shadow-sm min-w-[120px]">
                  <div className="flex gap-1.5">
                    <div className="size-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                    <div className="size-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="size-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{loadingText}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập tin nhắn */}
          <div className="p-4 bg-white border-t border-border/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center gap-2 bg-muted/30 rounded-2xl p-1.5 pl-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white transition-all border border-transparent focus-within:border-primary/20"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi bất cứ điều gì về nha khoa..."
                className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 p-0 text-sm font-medium h-10"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || input.trim().length === 0}
                className="rounded-xl size-10 shrink-0 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                <SendIcon className="size-4.5" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Nút bấm mở Chat */}
      {!isOpen && (
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-white/10 animate-in slide-in-from-right-4 duration-300">
            💬 Hỏi AI ngay!
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="size-16 rounded-2xl shadow-2xl shadow-blue-500/30 bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 group relative border-0"
          >
            <div className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
            <MessageCircleIcon className="size-7 group-hover:rotate-12 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
}
