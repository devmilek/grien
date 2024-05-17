import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { verificationTokens } from "./db/schema";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.identifier, email),
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = crypto.randomBytes(28).toString("hex");
  const expires = new Date(new Date().getTime() + 3600 * 1000 * 24); // 24 hours

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, email));
  }

  await db.insert(verificationTokens).values({
    identifier: email,
    token,
    expires,
  });

  return token;
};

// export const generateVerificationCode = async (email: string) => {
//   const token = crypto.randomInt(100_000, 1_000_000).toString();
//   const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes

//   const existingCode = await getVerificationCodeByEmail(email);

//   if (existingCode) {
//     await db.verificationCode.delete({
//       where: {
//         id: existingCode.id,
//       },
//     });
//   }

//   const verificationCode = await db.verificationCode.create({
//     data: {
//       email,
//       token,
//       expires,
//     },
//   });

//   return verificationCode;
// };
