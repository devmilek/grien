"use server";

import { DEFAULT_LOGIN_REDIRECT } from "@/config";
import { signIn } from "@/lib/auth";
import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/schemas/auth";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  try {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Niepoprawne pola!" };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: "Nie znaleziono konta o podanym adresie email" };
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });

    return { email: email };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Niepoprawny email lub hasło!" };
        default:
          return { error: "Coś poszło nie tak!" };
      }
    }

    throw error;
  }
};
