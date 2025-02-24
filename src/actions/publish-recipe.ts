"use server";

import {
  recipeBasicsSchema,
  RecipeBasicsSchema,
  recipeIngredientSchema,
  recipeStepSchema,
} from "@/app/(main)/utworz-przepis/_components/forms/schema";
import {
  IngredientWithId,
  PreparationStepWithId,
  RecipeAttribute,
} from "@/app/(main)/utworz-przepis/_components/use-recipe-store";
import db from "@/db";
import {
  RecipeCuisineInsert,
  recipeCuisines,
  RecipeDietInsert,
  recipeDiets,
  RecipeIngredientInsert,
  recipeIngredients,
  RecipeOccasionInsert,
  recipeOccasions,
  recipes,
  RecipeStepInsert,
  recipeSteps,
} from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/utils";
import { z } from "zod";
import { slugifyWithCounter } from "@sindresorhus/slugify";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

const attributesSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["diet", "cuisine", "occasion"]),
});

export const publishRecipe = async ({
  basics,
  ingredients,
  preparationSteps,
  attributes,
}: {
  basics: RecipeBasicsSchema;
  ingredients: IngredientWithId[];
  preparationSteps: PreparationStepWithId[];
  attributes: RecipeAttribute[];
}) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      status: 401,
      message: "Nie jesteś zalogowany",
    };
  }

  const validatedBasics = recipeBasicsSchema.safeParse(basics);

  if (!validatedBasics.success) {
    return {
      status: 400,
      message: "Nieprawidłowe dane podstawowe",
    };
  }

  const validatedIngredients = recipeIngredientSchema
    .array()
    .safeParse(ingredients);

  if (!validatedIngredients.success || ingredients.length === 0) {
    return {
      status: 400,
      message: "Dodaj składniki",
    };
  }

  const validatedPreparationSteps = recipeStepSchema
    .array()
    .safeParse(preparationSteps);

  if (!validatedPreparationSteps.success || preparationSteps.length === 0) {
    return {
      status: 400,
      message: "Dodaj kroki przygotowania",
    };
  }

  const validatedAttributes = attributesSchema.array().safeParse(attributes);

  if (!validatedAttributes.success) {
    console.log(validatedAttributes.error);
    return {
      status: 400,
      message: "Nieprawidłowe atrybuty",
    };
  }

  const slugify = slugifyWithCounter();
  let recipeSlug = slugify(basics.name);
  let isUnique = false;
  const recipeId = uuid();

  try {
    while (!isUnique) {
      const existingRecipe = await db.query.recipes.findFirst({
        columns: {
          slug: true,
        },
        where: eq(recipes.slug, recipeSlug),
      });

      if (!existingRecipe) {
        isUnique = true;
      } else {
        recipeSlug = slugify(basics.name);
      }
    }

    await db.transaction(async (tx) => {
      await tx.insert(recipes).values({
        name: basics.name,
        description: basics.description,
        difficulty: basics.difficulty,
        preparationTime: basics.preparationTime,
        portions: basics.portions,
        categoryId: basics.categoryId,
        slug: recipeSlug,
        userId: user.id,
        id: recipeId,
        imageId: basics.imageId,
      });

      const ingredientBatch: RecipeIngredientInsert[] = ingredients.map(
        (ingredient) => ({
          ingredient: ingredient.name,
          amount: ingredient.amount?.toString(),
          unit: ingredient.unit,
          recipeId: recipeId,
        })
      );

      const stepsBatch: RecipeStepInsert[] = preparationSteps.map(
        (step, index) => ({
          description: step.description,
          order: index + 1,
          recipeId: recipeId,
          content: step.description,
          image: step.imageId,
        })
      );

      const occasionsData = attributes.filter(
        (attr) => attr.type === "occasion"
      );
      const cuisinesData = attributes.filter((attr) => attr.type === "cuisine");
      const dietsData = attributes.filter((attr) => attr.type === "diet");

      const occasionsBatch: RecipeOccasionInsert[] = occasionsData.map(
        (attr) => ({
          recipeId: recipeId,
          occasionId: attr.id,
        })
      );

      const cuisinesBatch: RecipeCuisineInsert[] = cuisinesData.map((attr) => ({
        recipeId: recipeId,
        cuisineId: attr.id,
      }));

      const dietsBatch: RecipeDietInsert[] = dietsData.map((attr) => ({
        recipeId: recipeId,
        dietId: attr.id,
      }));

      await tx.insert(recipeIngredients).values(ingredientBatch);
      await tx.insert(recipeSteps).values(stepsBatch);
      await tx.insert(recipeIngredients).values(ingredientBatch);
      if (occasionsBatch.length > 0) {
        await tx.insert(recipeOccasions).values(occasionsBatch);
      }
      if (cuisinesBatch.length > 0) {
        await tx.insert(recipeCuisines).values(cuisinesBatch);
      }
      if (dietsBatch.length > 0) {
        await tx.insert(recipeDiets).values(dietsBatch);
      }
    });

    return {
      status: 200,
      message: "Przepis opublikowany",
      data: {
        slug: recipeSlug,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Wystąpił błąd",
    };
  }
};
