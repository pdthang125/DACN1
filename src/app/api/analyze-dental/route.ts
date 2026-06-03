import { NextRequest, NextResponse } from "next/server";

const YOLO_SERVER = process.env.YOLO_SERVER_URL || "http://localhost:8002";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 });
    }

    // Forward ảnh đến YOLO server
    const forwardForm = new FormData();
    forwardForm.append("file", file);

    const yoloRes = await fetch(`${YOLO_SERVER}/analyze-dental`, {
      method: "POST",
      body: forwardForm,
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    if (!yoloRes.ok) {
      const err = await yoloRes.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: err.error || "AI server error" },
        { status: 503 }
      );
    }

    const data = await yoloRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    if (error?.name === "TimeoutError") {
      return NextResponse.json(
        { success: false, error: "AI server timeout. Please try again." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Không thể kết nối đến AI server. Hãy chắc chắn rằng serve_yolo.py đang chạy!" },
      { status: 503 }
    );
  }
}
