import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import WhatToAsk from "@/components/landing/WhatToAsk";

import { syncUser } from "@/lib/actions/users";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  // Chưa đăng nhập
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Hero />
        <HowItWorks />
        <WhatToAsk />
        <CTA />
        <Footer />
      </div>
    );
  }

  // Đăng nhập rồi mới sync
  await syncUser();

  const adminEmails = [
    "minhntb.23itb@vku.udn.vn",
    "thangpd.23itb@vku.udn.vn",
    "nanght.23itb@vku.udn.vn",
  ];

  const userEmail =
    user.primaryEmailAddress?.emailAddress;

  // Admin
  if (
    userEmail &&
    adminEmails.includes(userEmail)
  ) {
    redirect("/dashboard/admin");
  }

  // Bệnh nhân
  redirect("/dashboard");
}