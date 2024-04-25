"use server";

import { db } from "@/lib/db";
import { attributesToRecipes, recipeAttribute } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const addAttribute = async (recipeId: number, attributeId: number) => {
  await db.insert(attributesToRecipes).values({
    recipeId,
    attributeId,
  });

  revalidatePath("/a-new-recipe/[slug]/podsumowanie", "page");
};

export const removeAttribute = async (
  recipeId: number,
  attributeId: number,
) => {
  await db
    .delete(attributesToRecipes)
    .where(
      and(
        eq(attributesToRecipes.recipeId, recipeId),
        eq(attributesToRecipes.attributeId, attributeId),
      ),
    );

  revalidatePath("/a-new-recipe/[slug]/podsumowanie", "page");
};
