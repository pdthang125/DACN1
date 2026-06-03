"use client";

import { MessageCircleIcon, XIcon, SendIcon, BotIcon, UserIcon, Sparkles, ImageIcon, CameraIcon, CheckCircleIcon } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imagePreview?: string;
  analysisResult?: {
    annotated_image?: string;
    detections: Array<{ name_vi: string; confidence: number; severity: string; advice: string }>;
    summary: string;
  };
}

function extractAction(text: string): { action: string; params?: Record<string, string> } | null {
  const match = text.match(/\[ACTION\](.*?)\[\/ACTION\]/s);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

function cleanActionTags(text: string): string {
  return text.replace(/\[ACTION\].*?\[\/ACTION\]/gs, "").trim();
}

const SEVERITY_COLORS: Record<string, string> = {
  low: "text-amber-600 bg-amber-50 border-amber-200",
  medium: "text-orange-600 bg-orange-50 border-orange-200",
  high: "text-red-600 bg-red-50 border-red-200",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Đang xử lý...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const callActionAPI = useCallback(async (actionData: { action: string; params?: Record<string, string> }): Promise<string> => {
    try {
      const res = await fetch("/api/chat/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actionData),
      });
      const data = await res.json();
      return data.success ? JSON.stringify(data.data) : `Lỗi: ${data.error}`;
    } catch {
      return "Lỗi: Không thể kết nối đến hệ thống.";
    }
  }, []);

  // ====== Phân tích ảnh răng bằng YOLO ======
  const handleImageAnalysis = async (file: File) => {
    const preview = URL.createObjectURL(file);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: "📷 Đã gửi ảnh để phân tích tình trạng răng...",
      imagePreview: preview,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsAnalyzing(true);

    const loadingId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: loadingId, role: "assistant", content: "🔍 Đang phân tích ảnh bằng AI Vision..." }]);

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/analyze-dental", { method: "POST", body: form });
      const data = await res.json();
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));

      if (data.success) {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: data.summary,
          analysisResult: { annotated_image: data.annotated_image, detections: data.detections, summary: data.summary },
        }]);
      } else {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: `❌ ${data.error || "Không thể phân tích ảnh. Hãy đảm bảo YOLO server đang chạy!"}`,
        }]);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      setMessages((prev) => [...prev, {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "❌ Không thể kết nối AI server. Hãy chạy: `python serve_yolo.py` trong thư mục training/yolo/",
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ====== Xử lý gửi tin nhắn text ======
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      let currentMessages = [...updatedMessages];
      let maxLoops = 5;
      while (maxLoops > 0) {
        setLoadingText("AI đang soạn trả lời...");
        const aiReply = await callChatAPI(currentMessages);
        const actionData = extractAction(aiReply);
        if (actionData) {
          const actionLabels: Record<string, string> = {
            getDoctors: "Đang tải danh sách bác sĩ...",
            getAvailableSlots: "Đang kiểm tra lịch trống...",
            bookAppointment: "Đang đặt lịch cho bạn...",
            getMyAppointments: "Đang tải lịch hẹn của bạn...",
          };
          setLoadingText(actionLabels[actionData.action] || "Đang xử lý...");
          const actionResult = await callActionAPI(actionData);
          const cleanReply = cleanActionTags(aiReply);
          if (cleanReply) {
            const partialMsg: ChatMessage = { id: (Date.now() + Math.random()).toString(), role: "assistant", content: cleanReply };
            currentMessages = [...currentMessages, partialMsg];
            setMessages([...currentMessages]);
          }
          currentMessages = [...currentMessages, {
            id: (Date.now() + Math.random()).toString(),
            role: "user",
            content: `[KẾT QUẢ HỆ THỐNG - không hiển thị cho khách]: ${actionResult}`,
          }];
          maxLoops--;
        } else {
          setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: aiReply }]);
          break;
        }
      }
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Dạ, hệ thống đang gặp trục trặc. Anh/Chị thử lại sau nhé! 🙏" }]);
    } finally {
      setIsLoading(false);
      setLoadingText("Đang xử lý...");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isOpen && (
        <div className="mb-4 bg-white border border-slate-200 shadow-2xl shadow-blue-900/10 rounded-[2rem] w-[360px] sm:w-[400px] h-[610px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-400">

          {/* ── Header ── */}
          <div className="bg-gradient-to-r from-[#1e40af] to-[#1d4ed8] px-5 py-4 flex items-center justify-between text-white relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="size-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
                  <BotIcon className="size-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-400 border-2 border-[#1d4ed8] rounded-full" />
              </div>
              <div>
                <h3 className="font-black text-sm">SmileCare AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="size-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-blue-200">Trực tuyến</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <div className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-lg border border-white/20">
                <CameraIcon className="size-2.5 text-blue-200" />
                <span className="text-[8px] font-black uppercase tracking-widest text-blue-100">AI Vision</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="size-8 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                <XIcon className="size-4" />
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="text-center py-6 space-y-4">
                <div className="bg-white size-14 rounded-[1.25rem] flex items-center justify-center mx-auto shadow-lg shadow-blue-900/10 border border-blue-100">
                  <Sparkles className="size-7 text-[#1d4ed8] animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm mb-1">Xin chào! 👋</h4>
                  <p className="text-[11px] text-slate-500 px-6 font-medium leading-relaxed">
                    Tư vấn nha khoa hoặc gửi ảnh để AI phát hiện bệnh sớm.
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[9px] font-black px-2.5 py-1 rounded-full border border-blue-200">
                    <MessageCircleIcon className="size-2.5" /> Chat AI
                  </span>
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[9px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
                    <CameraIcon className="size-2.5" /> Phân tích ảnh
                  </span>
                </div>
                <div className="grid gap-2 px-4">
                  {["💰 Tư vấn bảng giá", "👨‍⚕️ Tìm bác sĩ chuyên khoa", "📅 Đặt lịch khám nhanh"].map((text, i) => (
                    <button key={i} onClick={() => setInput(text.slice(3))}
                      className="text-left px-3.5 py-2.5 bg-white hover:bg-[#1d4ed8] hover:text-white transition-all rounded-xl text-[11px] font-bold border border-slate-200 shadow-sm">
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.filter((m) => !m.content.startsWith("[KẾT QUẢ HỆ THỐNG")).map((m) => (
                <div key={m.id} className={`flex gap-2 animate-in slide-in-from-bottom-2 duration-300 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`size-6 rounded-lg flex items-center justify-center shrink-0 border ${m.role === "user" ? "bg-white border-blue-200 text-blue-600" : "bg-[#1d4ed8] border-transparent text-white"}`}>
                    {m.role === "user" ? <UserIcon className="size-3" /> : <BotIcon className="size-3" />}
                  </div>
                  <div className={`max-w-[86%] space-y-2 flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                    {m.imagePreview && (
                      <img src={m.imagePreview} alt="Ảnh gốc" className="rounded-2xl max-h-36 object-cover border-2 border-blue-100 shadow-sm w-full" />
                    )}
                    <div className={`px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                      m.role === "user" ? "bg-[#1d4ed8] text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                    }`}>
                      {m.content}
                    </div>

                    {/* Kết quả YOLO */}
                    {m.analysisResult && (
                      <div className="w-full space-y-2">
                        {m.analysisResult.annotated_image && (
                          <div className="rounded-2xl overflow-hidden border-2 border-blue-100 shadow-md">
                            <div className="bg-[#1d4ed8] px-3 py-1.5 flex items-center gap-1.5">
                              <CameraIcon className="size-2.5 text-blue-200" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-blue-100">Kết quả AI Vision</span>
                            </div>
                            <img src={m.analysisResult.annotated_image} alt="Phân tích" className="w-full" />
                          </div>
                        )}
                        {m.analysisResult.detections.length > 0 && (
                          <div className="space-y-1.5">
                            {m.analysisResult.detections.slice(0, 4).map((d, i) => (
                              <div key={i} className={`rounded-xl p-2.5 border text-[10px] font-medium ${SEVERITY_COLORS[d.severity] || "bg-slate-50 border-slate-200 text-slate-600"}`}>
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-black">{d.name_vi}</span>
                                  <span className="opacity-60">{d.confidence}%</span>
                                </div>
                                <p className="opacity-75">{d.advice}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <button onClick={() => setInput("Tôi muốn đặt lịch khám")}
                          className="w-full flex items-center justify-center gap-1.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-[10px] font-black py-2 rounded-xl transition-colors">
                          <CheckCircleIcon className="size-3" /> Đặt lịch khám ngay
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {(isLoading || isAnalyzing) && (
              <div className="flex gap-2 animate-in fade-in duration-300">
                <div className="size-6 rounded-lg bg-[#1d4ed8] flex items-center justify-center shrink-0">
                  <BotIcon className="size-3 text-white" />
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 rounded-tl-none shadow-sm space-y-1.5">
                  <div className="flex gap-1">
                    {[0, 0.15, 0.3].map((d, i) => (
                      <div key={i} className="size-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {isAnalyzing ? "🔍 AI Vision đang phân tích..." : loadingText}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Area ── */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0 space-y-2">
            <button onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing || isLoading}
              className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1d4ed8] border-2 border-dashed border-blue-200 hover:border-[#1d4ed8] hover:bg-blue-50 rounded-2xl py-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <ImageIcon className="size-3.5" />
              {isAnalyzing ? "Đang phân tích ảnh..." : "📷 Gửi ảnh răng để AI phân tích"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageAnalysis(f); e.target.value = ""; }} />

            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2 bg-slate-50 rounded-2xl px-3.5 py-1 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Hỏi về nha khoa..."
                className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 p-0 text-[11px] font-medium h-9" />
              <button type="submit" disabled={isLoading || !input.trim()}
                className="size-8 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white flex items-center justify-center shadow-md disabled:opacity-40 transition-all shrink-0">
                <SendIcon className="size-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Toggle Button ── */}
      {!isOpen && (
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-2 rounded-xl shadow-lg border border-white/10 animate-in slide-in-from-right-4 duration-300">
            💬 Chat AI & Phân tích ảnh!
          </div>
          <button onClick={() => setIsOpen(true)}
            className="size-14 rounded-2xl shadow-2xl shadow-blue-500/30 bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative">
            <div className="absolute -top-1 -right-1 size-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            <MessageCircleIcon className="size-6" />
          </button>
        </div>
      )}
    </div>
  );
}
