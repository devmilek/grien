import React from "react";
import SignUpForm from "../_components/sign-up-form";

const SignUpPage = () => {
  return (
    <div>
      <header className="space-y-2">
        <h1 className="text-4xl font-display">Utwórz konto</h1>
        <p className="text-muted-foreground text-sm">
          Zacznij swoją kulinarną przygodę i utwórz swoje konto z użyciem adresu
          email lub kontynuuj z Google lub Facebook.
        </p>
      </header>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
