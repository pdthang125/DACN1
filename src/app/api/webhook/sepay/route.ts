import { getPaymentService } from "@/lib/services/sepay.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (body === null) return Response.json({ success: false }, { status: 400 });

  try {
    await getPaymentService().handleWebhook(request.headers.get("authorization"), body);
    return Response.json({ success: true });
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    if (code === "UNAUTHORIZED") return Response.json({ success: false }, { status: 401 });
    if (code === "INVALID_WEBHOOK" || code === "WRONG_RECEIVING_ACCOUNT") {
      return Response.json({ success: false }, { status: 400 });
    }
    console.error("SePay webhook failed", error);
    return Response.json({ success: false }, { status: 500 });
  }
}
