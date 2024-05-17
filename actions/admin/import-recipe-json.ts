"use server";

import { RecipeJSONSchema } from "@/app/admin/_components/import-recipe-button";
import { db } from "@/lib/db";
import {
  attributesToRecipes,
  category as categoryDb,
  ingredient,
  preparationStep,
  recipe,
  recipeAttribute,
} from "@/lib/db/schema";
import slugify from "@sindresorhus/slugify";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const importRecipeJson = async (
  data: z.infer<typeof RecipeJSONSchema>,
) => {
  const category = await db.query.category.findFirst({
    where: eq(categoryDb.slug, data.category),
  });
  if (!category) {
    throw new Error(`Category not found: ${data.category}`);
  }
  const createdRecipe = await db
    .insert(recipe)
    .values({
      name: data.name,
      description: data.description,
      difficulty: data.difficulty,
      preparationTime: data.preparationTime,
      servings: data.servings,
      slug: slugify(data.name),
      categoryId: category.id,
      userId: "1d24491a-c164-4c64-9a0b-b3fd7b72af8b",
      imageUrl: "asd",
    })
    .returning();

  for (const item of data.ingredients) {
    await db
      .insert(ingredient)
      .values({
        recipeId: createdRecipe[0].id,
        quantity: item.quantity,
        unit: item.unit,
        name: item.name,
      })
      .execute();
  }

  let preparationIndex = 0;

  for (const item of data.preparationSteps) {
    await db.insert(preparationStep).values({
      recipeId: createdRecipe[0].id,
      description: item.description,
      position: preparationIndex++,
    });
  }

  for (const item of data.attributes) {
    const attribute = await db.query.recipeAttribute.findFirst({
      where: eq(recipeAttribute.slug, item),
    });

    if (!attribute) {
      throw new Error(`Attribute not found: ${item}`);
    }

    await db.insert(attributesToRecipes).values({
      attributeId: attribute.id,
      recipeId: createdRecipe[0].id,
    });
  }

  preparationIndex = 0;
};
