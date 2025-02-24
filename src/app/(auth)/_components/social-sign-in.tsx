"use client";

import { Icons } from "@/components/global/icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const SocialSignIn = () => {
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [isGithubLoading, setIsGithubLoading] = React.useState(false);
  const handleClick = async (provider: "github" | "google") => {
    if (provider === "google") {
      setIsGoogleLoading(true);
    } else {
      setIsGithubLoading(true);
    }

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
      newUserCallbackURL: "/uzupelnij-profil",
    });

    if (error) {
      toast.error("Wystąpił błąd podczas logowania.", {
        description: "Spróbuj ponownie lub użyj innej metody",
      });
    }

    if (provider === "google") {
      setIsGoogleLoading(false);
    } else {
      setIsGithubLoading(false);
    }
  };
  return (
    <div>
      <div className="relative mb-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Lub kontunuuj z
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => handleClick("google")}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Icons.google />
          )}
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleClick("github")}
          disabled={isGithubLoading}
        >
          {isGithubLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Icons.github />
          )}
          GitHub
        </Button>
      </div>
    </div>
  );
};

export default SocialSignIn;
