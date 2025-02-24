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

const attributesSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["diet", "cuisine", "occasion"]),
});

export const updateRecipe = async ({
  id,
  basics,
  ingredients,
  preparationSteps,
  attributes,
}: {
  id: string;
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

  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, id),
  });

  if (!recipe) {
    return {
      status: 404,
      message: "Nie znaleziono przepisu",
    };
  }

  if (recipe.userId !== user.id) {
    return {
      status: 403,
      message: "Nie masz uprawnień do edycji tego przepisu",
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
  let isUnique = recipeSlug === recipe.slug;

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
      // Aktualizacja podstawowych danych przepisu
      await tx
        .update(recipes)
        .set({
          name: basics.name,
          description: basics.description,
          difficulty: basics.difficulty,
          preparationTime: basics.preparationTime,
          portions: basics.portions,
          categoryId: basics.categoryId,
          slug: recipeSlug,
          imageId: basics.imageId,
        })
        .where(eq(recipes.id, id));

      // Usuń stare dane
      await tx
        .delete(recipeIngredients)
        .where(eq(recipeIngredients.recipeId, id));
      await tx.delete(recipeSteps).where(eq(recipeSteps.recipeId, id));
      await tx.delete(recipeOccasions).where(eq(recipeOccasions.recipeId, id));
      await tx.delete(recipeCuisines).where(eq(recipeCuisines.recipeId, id));
      await tx.delete(recipeDiets).where(eq(recipeDiets.recipeId, id));

      // Dodaj nowe dane
      const ingredientBatch: RecipeIngredientInsert[] = ingredients.map(
        (ingredient) => ({
          ingredient: ingredient.name,
          amount: ingredient.amount?.toString(),
          unit: ingredient.unit,
          recipeId: id,
        })
      );

      const stepsBatch: RecipeStepInsert[] = preparationSteps.map(
        (step, index) => ({
          description: step.description,
          order: index + 1,
          recipeId: id,
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
          recipeId: id,
          occasionId: attr.id,
        })
      );

      const cuisinesBatch: RecipeCuisineInsert[] = cuisinesData.map((attr) => ({
        recipeId: id,
        cuisineId: attr.id,
      }));

      const dietsBatch: RecipeDietInsert[] = dietsData.map((attr) => ({
        recipeId: id,
        dietId: attr.id,
      }));

      // Wstaw nowe dane
      await tx.insert(recipeIngredients).values(ingredientBatch);
      await tx.insert(recipeSteps).values(stepsBatch);
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
      message: "Przepis zaktualizowany",
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
