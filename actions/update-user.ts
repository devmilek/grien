"use server";

import { auth, update } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const updateUser = async (name: string) => {
  console.log("Updating user name to", name);
  const session = await auth();
  await db
    .update(users)
    .set({ name })
    .where(eq(users.id, session?.user.id));
  await update({
    user: {
      name,
    },
  });
};
