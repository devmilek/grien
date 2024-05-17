"use client";

import { oAuthSignIn } from "@/actions/server-sign-in";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/config";
import { signIn } from "@/lib/auth";
import { useSearchParams } from "next/navigation";
import React from "react";

const Socials = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = async (provider: "google" | "github") => {
    await oAuthSignIn(provider);
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <Icons.google className="h-5 w-5 mr-2" />
        Google
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <Icons.github className="h-5 w-5 mr-2" />
        Github
      </Button>
    </div>
  );
};

export default Socials;
