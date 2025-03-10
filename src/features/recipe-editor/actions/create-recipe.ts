"use server";

import { getCurrentSession } from "@/lib/auth/utils";
import { slugifyWithCounter } from "@sindresorhus/slugify";
import db from "@/db";
import {
  RecipeAttributeInsert,
  recipeAttributes,
  RecipeIngredientInsert,
  recipeIngredients,
  recipes,
  RecipeStepInsert,
  recipeSteps,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { ContextRecipe, RecipeActionResult } from "../types";

/**
 * Tworzy nowy przepis w bazie danych
 */
export async function createRecipe(
  recipe: ContextRecipe
): Promise<RecipeActionResult> {
  try {
    // Sprawdzenie autoryzacji
    const { session, user } = await getCurrentSession();

    if (!session || !user) {
      return {
        success: false,
        error: "Musisz być zalogowany, aby utworzyć przepis",
      };
    }

    // Pobierz userId z sesji
    const userId = user.id;

    // Tworzenie unikalnego ID dla przepisu
    const recipeId = recipe.id || uuidv4();
    const slugify = slugifyWithCounter();
    let recipeSlug = slugify(recipe.basics.name);
    let isUnique = false;

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
        recipeSlug = slugify(recipe.basics.name);
      }
    }

    // Wstawianie podstawowych danych przepisu
    await db.insert(recipes).values({
      id: recipeId,
      name: recipe.basics.name,
      description: recipe.basics.description,
      difficulty: recipe.basics.difficulty,
      preparationTime: recipe.basics.preparationTime,
      portions: recipe.basics.portions,
      imageId: recipe.basics.imageId,
      categoryId: recipe.basics.categoryId,
      status: recipe.status || "draft",
      userId: userId,
      slug: recipeSlug,
    });

    // Wstawianie składników
    if (recipe.ingredients.length > 0) {
      const ingredientsBatch: RecipeIngredientInsert[] = recipe.ingredients.map(
        (ingredient) => ({
          recipeId: recipeId,
          name: ingredient.name,
          amount: ingredient.amount.toString(),
          unit: ingredient.unit || "",
        })
      );
      await db.insert(recipeIngredients).values(ingredientsBatch);
    }

    // Wstawianie kroków
    if (recipe.steps.length > 0) {
      const stepsBatch: RecipeStepInsert[] = recipe.steps.map(
        (step, index) => ({
          recipeId: recipeId,
          content: step.description,
          imageId: step.imageId,
          order: index,
        })
      );
      await db.insert(recipeSteps).values(stepsBatch);
    }

    if (recipe.attributes.length > 0) {
      // Wstawianie atrybutów
      const attributesBatch: RecipeAttributeInsert[] = recipe.attributes.map(
        (attr) => ({
          recipeId: recipeId,
          attributeId: attr,
        })
      );
      await db.insert(recipeAttributes).values(attributesBatch);
    }

    return {
      success: true,
      id: recipeId,
      slug: recipeSlug,
    };
  } catch (error) {
    console.error("Błąd podczas tworzenia przepisu:", error);
    return {
      success: false,
      error: "Wystąpił błąd podczas tworzenia przepisu",
    };
  }
}
