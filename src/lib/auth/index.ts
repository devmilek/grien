import db from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { sendEmail } from "../nodemailer";
import { openAPI } from "better-auth/plugins";

const DISABLED_USERNAMES = [
  "admin",
  "root",
  "superuser",
  "profil",
  "ustawienia",
];

export const auth = betterAuth({
  plugins: [
    openAPI(),
    username({
      usernameValidator: (username) => {
        if (DISABLED_USERNAMES.includes(username)) return false;
        return true;
      },
    }),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
        fieldName: "bio",
        input: true,
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Potwierdź usunięcie konta",
          text: `Kliknij w link, aby usunąć konto: ${url}`,
        });
      },
      // TODO: implement after delete account
      afterDeleteAccount: async () => {
        console.log("User deleted");
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      await sendEmail({
        to: user.email,
        subject: "Potwierdź adres email",
        text: `Kliknij w link, aby potwierdzić adres email: ${url}. Twój token to: ${token}`,
      });
    },
  },
  advanced: {
    generateId: false,
  },
});

export type User = (typeof auth.$Infer.Session)["user"];
export type Session = (typeof auth.$Infer.Session)["session"];
