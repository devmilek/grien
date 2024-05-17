import { ArrowLeft, ArrowRight, MailIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const VerificationPending = () => {
  return (
    <div className="text-center">
      <div className="h-14 w-14 mb-6 rounded-xl border flex items-center justify-center text-gray-700 mx-auto">
        <MailIcon className="w-7 h-7" />
      </div>
      <h1 className="text-4xl font-display mb-3">Sprawdź swój adres email</h1>
      <p className="text-gray-500 text-sm">
        Kliknij w link weryfikacyjny, po kliknięciu twój adres email zostanie
        zweryfikowany i zostaniesz automatycznie zalogowany.
      </p>
      <Link
        href="/"
        className="text-emerald-600 font-semibold text-xs flex justify-center mt-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Wróć do strony głównej
      </Link>
    </div>
  );
};

export default VerificationPending;
