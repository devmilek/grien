"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const setPassword = async (password: string) => {
  const { status } = await auth.api.setPassword({
    body: {
      newPassword: password,
    },
    headers: await headers(),
  });

  return status;
};
