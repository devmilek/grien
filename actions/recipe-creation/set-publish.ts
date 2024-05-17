"use server";

import { db } from "@/lib/db";
import { recipe } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const setPublish = async (id: number, isPublished: boolean) => {
  await db
    .update(recipe)
    .set({
      published: isPublished,
    })
    .where(eq(recipe.id, id));
};
