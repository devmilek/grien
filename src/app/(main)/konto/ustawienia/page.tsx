import { getCurrentSession } from "@/lib/auth/utils";
import { constructMetadata } from "@/utils/construct-metadata";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import UserSettings from "@/features/user-profile/components/user-settings";

export const metadata: Metadata = constructMetadata({
  title: "Ustawienia",
  description: "Zmień hasło, adres email lub inne ustawienia konta",
  noIndex: true,
});

const SettingsPage = async () => {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/logowanie");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-display mb-8">Ustawienia</h1>
      <UserSettings />
    </div>
  );
};

export default SettingsPage;
