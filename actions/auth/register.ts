"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas/auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/actions/auth/mail";
import { login } from "./login";
import { users } from "@/lib/db/schema";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Błędne pola!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Adres email jest już zajęty!" };
  }

  await db.insert(users).values({
    email,
    password: hashedPassword,
    name,
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(email, verificationToken);

  return { success: "Email z kodem weryfikacyjnym został wysłany" };
};
