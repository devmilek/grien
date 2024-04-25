"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { recipe } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { BasicsInformationSchema } from "@/schemas/recipe";

export const editRecipeBasics = async (
  slug: string,
  data: z.infer<typeof BasicsInformationSchema>,
) => {
  const session = await auth();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const validatedData = BasicsInformationSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      error: "Invalid data",
    };
  }

  const {
    name,
    image,
    description,
    categoryId,
    servings,
    difficulty,
    preparationTime,
  } = validatedData.data;

  await db
    .update(recipe)
    .set({
      name,
      description,
      imageUrl: image,
      categoryId: Number(categoryId),
      servings,
      difficulty,
      preparationTime,
    })
    .where(and(eq(recipe.slug, slug), eq(recipe.userId, session.user.id)));

  return { slug };
};
