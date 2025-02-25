import { auth } from "@/lib/auth";
import { getCurrentSession } from "@/lib/auth/utils";
import { constructMetadata } from "@/utils/construct-metadata";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import ChangePasswordForm from "./_component/change-password-form";
import { Separator } from "@/components/ui/separator";
import ConnectedAccountsForm from "./_component/connected-accounts-form";
import DeleteAccountForm from "./_component/delete-account-form";

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

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const isPasswordSet = accounts.some(
    (account) => account.provider === "credential"
  );

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-display mb-8">Ustawienia</h1>
      <div className="p-8 rounded-xl bg-white space-y-8">
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
    </div>
  );
};

export default SettingsPage;
