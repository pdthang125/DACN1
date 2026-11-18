import type { ComponentProps } from "react";
import AppointmentConfirmationEmail from "@/components/emails/AppointmentConfirmationEmail";

export async function sendAppointmentConfirmationEmail(
  userEmail: string,
  details: ComponentProps<typeof AppointmentConfirmationEmail>,
) {
  const { default: resend } = await import("@/lib/resend");
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "DentWise <no-reply@resend.dev>",
    to: [userEmail],
    subject: "Appointment Confirmation - DentWise",
    react: AppointmentConfirmationEmail(details),
  });
}
