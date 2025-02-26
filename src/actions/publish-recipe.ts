"use server";

import {
  recipeBasicsSchema,
  RecipeBasicsSchema,
  recipeIngredientSchema,
  recipeStepSchema,
} from "@/app/(main)/przepisy/utworz/_components/forms/schema";
import {
  IngredientWithId,
  PreparationStepWithId,
} from "@/app/(main)/przepisy/utworz/_components/use-recipe-store";
import db from "@/db";
import {
  Attribute,
  attributesTypes,
  RecipeAttributeInsert,
  recipeAttributes,
  RecipeIngredientInsert,
  recipeIngredients,
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
  type: z.enum(attributesTypes),
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
  attributes: Attribute[];
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
          name: ingredient.name,
          amount: ingredient.amount?.toString() ?? null,
          unit: ingredient.unit ?? null,
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

      const attributesBatch: RecipeAttributeInsert[] = attributes.map(
        (attr) => ({
          attributeId: attr.id,
          recipeId: recipeId,
        })
      );

      await tx.insert(recipeIngredients).values(ingredientBatch);
      await tx.insert(recipeSteps).values(stepsBatch);
      await tx.insert(recipeIngredients).values(ingredientBatch);

      if (attributesBatch.length > 0) {
        await tx.insert(recipeAttributes).values(attributesBatch);
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
