import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/utils/construct-metadata";
import Link from "next/link";
import React from "react";

export const metadata = constructMetadata({
  title: "Twoje konto zostało usunięte",
  description: "Dziękujemy za korzystanie z naszej aplikacji.",
  noIndex: true,
});

const GoodbyePage = () => {
  return (
    <div className="container">
      <h1 className="font-display text-2xl">
        Twoje konto zostało usunięte. Dziękujemy za korzystanie z naszej
        aplikacji.
      </h1>
      <p className="text-muted-foreground mt-2">
        Jeśli chcesz wrócić, załóż nowe konto. Dziękujemy i do zobaczenia!
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Wróć do strony głównej</Link>
      </Button>
    </div>
  );
};

export default GoodbyePage;
