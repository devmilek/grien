import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { LoginSchema } from "@/schemas/auth";
import { getUserByEmail, getUserById } from "../data/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend";

import NextAuth from "next-auth";
import { eq } from "drizzle-orm";
import { verificationTokens } from "./db/schema";

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub,
    Resend({
      from: "grien@devmilek.pl",
    }),
    // Credentials({
    //   credentials: {
    //     token: { label: "Token", type: "text" },
    //   },
    //   authorize: async (credentials) => {
    //     console.log("Logowanie tokenem");
    //     const token = credentials.token;

    //     if (!token || typeof token !== "string") {
    //       return null;
    //     }

    //     const verificationToken = await db.query.verificationTokens.findFirst({
    //       where: eq(verificationTokens.token, token),
    //     });

    //     if (!verificationToken) {
    //       return null;
    //     }

    //     const user = await getUserByEmail(verificationToken.identifier);

    //     if (!user) {
    //       throw new Error("User not found");
    //     }

    //     console.log("Logowanie tokenem", user);

    //     return {
    //       id: user.id,
    //       name: user.name,
    //       email: user.email,
    //     };
    //   },
    // }),
    // Credentials({
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   authorize: async (credentials) => {
    //     const { email, password } = credentials;
    //     const user = await getUserByEmail(email as string);

    //     if (!user || !user.password) {
    //       return null;
    //     }

    //     const isValid = await bcrypt.compare(password as string, user.password);

    //     if (!isValid) {
    //       return null;
    //     }

    //     console.log("Logowanie", user, isValid);

    //     return {
    //       id: user.id,
    //       name: user.name,
    //       email: user.email,
    //     };
    //   },
    // }),
  ],
});
