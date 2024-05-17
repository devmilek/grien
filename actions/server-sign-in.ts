"use server";

import { signIn } from "@/lib/auth";

export const oAuthSignIn = async (provider: "github" | "google") => {
  await signIn(provider);
};

export const magicLinkSignIn = async (email: string) => {
  await signIn("resend", { email });
};

export const credentialSignIn = async (email: string, password: string) => {
  await signIn("credentials", { email, password });
};
