import { redirect } from "next/navigation";
import React from "react";
import SettingsForm from "./_components/settings-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { getUserById } from "@/data/user";
import { auth } from "@/lib/auth";

const SettingsPage = async () => {
  const session = await auth();
  if (!session) {
    return redirect("/");
  }
  const user = await getUserById(session.user.id);
  if (!user) {
    return redirect("/");
  }
  return (
    <section className="max-w-2xl mx-auto pt-10">
      <h1 className="font-display text-3xl">Ustawienia konta</h1>
      <p className="text-sm text-neutral-600 mt-1 mb-6">
        Zaktualizuj swoję zdjęcie oraz dane osobowe tutaj.
      </p>
      {!user.emailVerified && (
        <Alert variant="destructive" className="mb-4 bg-red-50">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle className="tracking-wide">
            Zweryfikuj swój email
          </AlertTitle>
          <AlertDescription className="text-xs">
            Wejdź na swoją skrzynkę email i zweryfikuj swój adres, klikając w
            link zawarty w wiadomości.
          </AlertDescription>
        </Alert>
      )}
      <SettingsForm user={user} />
    </section>
  );
};

export default SettingsPage;
