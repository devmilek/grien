import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import { getCurrentSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import React from "react";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await getCurrentSession();

  if (user && !user.username) redirect("/uzupelnij-profil");

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-gray-50">
        <div className="min-h-screen pb-12">{children}</div>
        <Footer />
      </main>
    </>
  );
};

export default MainLayout;
