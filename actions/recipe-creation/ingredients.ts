"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ingredient } from "@/lib/db/schema";
import { IngredientSchema } from "@/schemas/recipe";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const addIngredient = async (
  data: z.infer<typeof IngredientSchema>,
  recipeId: number,
) => {
  const validatedFields = IngredientSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  const { name, quantity, unit } = validatedFields.data;

  await db.insert(ingredient).values({
    name,
    quantity,
    unit,
    recipeId,
  });

  revalidatePath("/a-new-recipe/[slug]/skladniki", "page");
};

export const deleteIngredient = async (ingredientId: number) => {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  await db.delete(ingredient).where(eq(ingredient.id, ingredientId));

  revalidatePath("/a-new-recipe/[slug]/skladniki", "page");
};
