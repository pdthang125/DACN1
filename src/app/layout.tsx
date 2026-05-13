import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TanStackProvider from "@/components/providers/TanStackProvider";
import { Toaster } from "sonner";
import ChatWidget from "@/components/chat/ChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DentWise - Nha Khoa Thông Minh với AI",
  description: "DentWise kết hợp đội ngũ bác sĩ tâm huyết cùng trí tuệ nhân tạo để mang đến trải nghiệm chăm sóc răng miệng thông minh, nhẹ nhàng và minh bạch nhất.",
  keywords: ["nha khoa", "AI", "đặt lịch khám", "tư vấn răng miệng", "DentWise"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TanStackProvider>
      <ClerkProvider
        appearance={{
          variables: {
            colorPrimary: "#2563eb",
            colorBackground: "#ffffff",
            colorText: "#0f172a",
            colorTextSecondary: "#64748b",
            colorInputBackground: "#f8fafc",
          },
        }}
      >
        <html lang="vi">
          <body className={`${inter.variable} antialiased`} style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            {/* this is done in the home page component */}
            {/* <UserSync /> */}
            <Toaster />
            {children}
            <ChatWidget />
          </body>
        </html>
      </ClerkProvider>
    </TanStackProvider>
  );
}
