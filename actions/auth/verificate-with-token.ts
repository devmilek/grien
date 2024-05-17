"use server";

import { db } from "@/lib/db";
import { getVerificationTokenByToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { signIn } from "@/lib/auth";

export const verificateWithToken = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token nie istnieje!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token wygasł!" };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) {
    return { error: "Email nie istnieje!" };
  }

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.email, existingToken.identifier));

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.token, token));

  await signIn("tokenAuth", {
    token,
  });

  return { success: "Email zweryfikowany!" };
};
