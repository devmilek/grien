import React from "react";
import SignInForm from "../_components/sign-in-form";
import Link from "next/link";
import { constructMetadata } from "@/utils/construct-metadata";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Zaloguj się",
  description:
    "Zaloguj się do swojego konta, aby kontynuować swoją kulinarną przygodę.",
});

const SignInPage = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-display">Witaj ponownie</h1>
        <p className="text-muted-foreground text-sm">
          Zaloguj się do swojego konta, aby kontynuować swoją kulinarną
          przygodę.
        </p>
      </header>

      <SignInForm />
      <div>
        <p className="text-center text-sm text-muted-foreground">
          Nie masz jeszcze konta?{" "}
          <Link
            href="/rejestracja"
            className="text-primary hover:underline font-medium"
          >
            Utwórz konto
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
