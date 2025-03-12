import React from "react";
import ChangePasswordForm from "./change-password-form";
import { Separator } from "@/components/ui/separator";
import ConnectedAccountsForm from "./connected-accounts-form";
import DeleteAccountForm from "./delete-account-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import EditProfileForm from "../edit-profile-form";
import { getCurrentSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

const UserSettings = async () => {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/logowanie");
  }

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const isPasswordSet = accounts.some(
    (account) => account.provider === "credential"
  );

  return (
    <div className="p-8 rounded-xl bg-white space-y-8">
      <div className="grid gap-8 grid-cols-2">
        <div>
          <h2 className="font-semibold">Edytuj profil</h2>
          <p className="text-sm text-muted-foreground">
            Zaktualizuj swoje dane osobowe, abyśmy mogli lepiej Cię poznać.
          </p>
        </div>
        <div className="rounded-xl border">
          <EditProfileForm user={user} />
        </div>
      </div>
      <Separator />
      <div className="grid gap-8 grid-cols-2">
        <div>
          <h2 className="font-semibold">Zmień hasło</h2>
          <p className="text-sm text-muted-foreground">
            Aby dokonać aktualizacji, wprowadź istniejące hasło, a następnie
            nowe. Jeśli nie znasz istniejącego hasła, wyloguj się i użyj linku
            zapomniałem hasła.
          </p>
        </div>
        <ChangePasswordForm isPasswordSet={isPasswordSet} />
      </div>
      <Separator />
      <div className="grid gap-8 grid-cols-2">
        <div>
          <h2 className="font-semibold">Połączone konta</h2>
          <p className="text-sm text-muted-foreground">
            Zarejestruj się szybciej na swoje konto, łącząc konto z innymi
            dostawcami.
          </p>
        </div>
        <ConnectedAccountsForm accounts={accounts} />
      </div>
      <Separator />
      <div className="grid gap-8 grid-cols-2">
        <div>
          <h2 className="font-semibold">Usuń konto</h2>
          <p className="text-sm text-muted-foreground">
            Usuń swoje konto i wszystkie dane z naszej bazy danych.
          </p>
        </div>
        <DeleteAccountForm />
      </div>
    </div>
  );
};

export default UserSettings;
