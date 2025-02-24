import Navbar from "@/components/global/navbar";
import { getCurrentSession } from "@/lib/auth/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Grien - Odkrywaj Przepisy, Twórz Własne Książki Kucharskie",
  description:
    "Grien to platforma dla miłośników gotowania! Przeglądaj tysiące przepisów, dodawaj własne propozycje, twórz spersonalizowane książki kucharskie i dziel się kulinarną pasją z innymi użytkownikami.",
  keywords: [
    "przepisy kulinarne",
    "książka kucharska",
    "gotowanie",
    "platforma dla kucharzy",
    "udostępnianie przepisów",
    "społeczność kucharzy",
    "przepisy domowe",
    "tworzenie przepisów",
  ],
  openGraph: {
    title: "Grien - Twoja Wirtualna Książka Kucharska",
    description:
      "Odkrywaj, twórz i dziel się przepisami z pasjonatami gotowania. Dołącz do społeczności Grien i rozwijaj swoje kulinarne umiejętności!",
  },
};

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
