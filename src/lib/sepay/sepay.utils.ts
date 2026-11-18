import { randomBytes } from "crypto";

const PAYMENT_CODE_LENGTH = 8;
const PAYMENT_CODE_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generatePaymentCode(): string {
  const bytes = randomBytes(PAYMENT_CODE_LENGTH);

  return Array.from(bytes)
    .map((byte) => PAYMENT_CODE_CHARSET[byte % PAYMENT_CODE_CHARSET.length])
    .join("");
}
export function generateVietQRUrl(
  amount: number,
  appointmentId: string,
): string {
  const bankCode = process.env.SEPAY_BANK_CODE;
  const accountNumber = process.env.SEPAY_BANK_ACCOUNT;

  if (!bankCode || !accountNumber) {
    throw new Error("VIETQR_CONFIG_MISSING");
  }

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error("INVALID_PAYMENT_AMOUNT");
  }

  const addInfo = encodeURIComponent(`SEVQR${appointmentId}`);

  return (
    `https://img.vietqr.io/image/${bankCode}-${accountNumber}-print.png` +
    `?amount=${amount}&addInfo=${addInfo}`
  );
}

export function extractAppointmentId(
  code: string | null,
  content: string | null,
): string | null {
  const prefix = process.env.SEPAY_DENTAL_PREFIX;

  if (!prefix) {
    throw new Error("SEPAY_PREFIX_MISSING");
  }

  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pattern = new RegExp(
    `(?:^|[^a-zA-Z0-9])${escapedPrefix}([a-zA-Z0-9]+)(?=$|[^a-zA-Z0-9])`,
    "i",
  );

  for (const value of [code, content]) {
    if (!value) continue;

    const match = value.match(pattern);

    if (match) {
      return match[1];
    }
  }

  return null;
}