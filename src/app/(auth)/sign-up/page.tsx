import React from "react";
import SignUpForm from "../_components/sign-up-form";
import Link from "next/link";
import { constructMetadata } from "@/utils/construct-metadata";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Utwórz konto",
  description:
    "Zacznij swoją kulinarną przygodę i utwórz swoje konto z użyciem adresu email lub kontynuuj z Google lub Facebook.",
});

const SignUpPage = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-display">Utwórz konto</h1>
        <p className="text-muted-foreground text-sm">
          Zacznij swoją kulinarną przygodę i utwórz swoje konto z użyciem adresu
          email lub kontynuuj z Google lub Facebook.
        </p>
      </header>
      <SignUpForm />
      <div>
        <p className="text-center text-sm text-muted-foreground">
          Masz już konto?{" "}
          <Link
            href="/sign-in"
            className="text-primary hover:underline font-medium"
          >
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
