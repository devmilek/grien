"use server";

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { slugifyWithCounter } from "@sindresorhus/slugify";
import { eq } from "drizzle-orm";
import { recipe } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { BasicsInformationSchema } from "@/schemas/recipe";

export const createRecipe = async (
  data: z.infer<typeof BasicsInformationSchema>,
) => {
  console.log("tworze przepis");
  const session = await auth();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const validatedData = BasicsInformationSchema.safeParse(data);
  const slugify = slugifyWithCounter();

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

  let slug = slugify(name);
  let isSlugUnique = false;

  while (!isSlugUnique) {
    const checkSlug = await db.query.recipe.findFirst({
      where: eq(recipe.slug, slug),
    });

    if (!checkSlug) {
      isSlugUnique = true;
    } else {
      slug = slugify(name);
    }
  }

  slugify.reset();

  console.log("przed dodaniem do bazy");

  await db.insert(recipe).values({
    name,
    slug,
    description,
    imageUrl: image,
    categoryId: Number(categoryId),
    userId: session.user.id,
    servings,
    difficulty,
    preparationTime,
  });

  return { slug };
};
