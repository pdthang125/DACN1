"use server";

import { getPaymentStatusService } from "@/lib/services/payment.service";

export async function getPaymentStatusAction(
  appointmentId: string,
) {
  try {
    return await getPaymentStatusService(appointmentId);
  } catch (error) {
    console.error("Get payment status error:", error);
    throw error;
  }
}