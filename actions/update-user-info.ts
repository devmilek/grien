"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const updateUserInfo = async ({
  name,
  bio,
}: {
  name: string;
  bio: string;
}) => {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  await db
    .update(users)
    .set({
      name,
      bio,
    })
    .where(eq(users.id, session.user.id));
};
