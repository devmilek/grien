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
      <main className="min-h-screen pt-20 pb-12 bg-gray-50">{children}</main>
    </>
  );
};

export default MainLayout;
