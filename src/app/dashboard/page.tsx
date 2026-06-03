import ActivityOverview from "@/components/dashboard/ActivityOverview";
import MainActions from "@/components/dashboard/MainActions";
import WelcomeSection from "@/components/dashboard/WelcomeSection";

import Navbar from "@/components/Navbar";

import {
  currentUser,
} from "@clerk/nextjs/server";

import {
  redirect,
} from "next/navigation";

async function DashboardPage() {

  const user =
    await currentUser();

  // CHƯA LOGIN 😎🔥

  if (!user) {

    redirect("/");

  }

  return (
    <>

      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8 pt-24">

        <WelcomeSection />

        <MainActions />

        <ActivityOverview />

      </div>

    </>
  );
}

export default DashboardPage;