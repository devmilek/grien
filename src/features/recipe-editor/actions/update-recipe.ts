"use server";

import { ActionResult } from "next/dist/server/app-render/types";
import { getCurrentSession } from "@/lib/auth/utils";
import db from "@/db";
import { eq } from "drizzle-orm";
import {
  RecipeAttributeInsert,
  recipeAttributes,
  RecipeIngredientInsert,
  recipeIngredients,
  recipes,
  RecipeStepInsert,
  recipeSteps,
} from "@/db/schema";
import { ContextRecipe } from "../types";

/**
 * Aktualizuje istniejący przepis
 */
export async function updateRecipe(
  recipe: ContextRecipe
): Promise<ActionResult> {
  try {
    // Sprawdzenie czy przepis ma ID
    if (!recipe.id) {
      return {
        success: false,
        error: "Nie można zaktualizować przepisu bez ID",
      };
    }

    // Sprawdzenie autoryzacji
    const { session, user } = await getCurrentSession();

    if (!session || !user) {
      return {
        success: false,
        error: "Musisz być zalogowany, aby zaktualizować przepis",
      };
    }

    // Sprawdź, czy przepis należy do użytkownika
    const existingRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, recipe.id),
    });

    if (!existingRecipe) {
      return {
        success: false,
        error: "Przepis nie istnieje",
      };
    }

    if (existingRecipe.userId !== user.id) {
      return {
        success: false,
        error: "Nie masz uprawnień do edycji tego przepisu",
      };
    }

    // Aktualizacja podstawowych danych przepisu
    await db
      .update(recipes)
      .set({
        name: recipe.basics.name,
        description: recipe.basics.description,
        difficulty: recipe.basics.difficulty,
        preparationTime: recipe.basics.preparationTime,
        portions: recipe.basics.portions,
        imageId: recipe.basics.imageId,
        categoryId: recipe.basics.categoryId,
        status: recipe.status || existingRecipe.status,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, recipe.id));

    // Usunięcie starych składników i dodanie nowych
    await db
      .delete(recipeIngredients)
      .where(eq(recipeIngredients.recipeId, recipe.id));

    if (recipe.ingredients.length > 0) {
      const ingredientsBatch: RecipeIngredientInsert[] = recipe.ingredients.map(
        (ingredient) => ({
          id: ingredient.id,
          recipeId: recipe.id!,
          name: ingredient.name,
          amount: ingredient.amount.toString(),
          unit: ingredient.unit || "",
        })
      );

      await db.insert(recipeIngredients).values(ingredientsBatch);
    }

    // Usunięcie starych kroków i dodanie nowych
    await db.delete(recipeSteps).where(eq(recipeSteps.recipeId, recipe.id));

    if (recipe.steps.length > 0) {
      const stepsBatch: RecipeStepInsert[] = recipe.steps.map(
        (step, index) => ({
          id: step.id,
          recipeId: recipe.id!,
          content: step.description,
          imageId: step.imageId,
          order: index,
        })
      );
      await db.insert(recipeSteps).values(stepsBatch);
    }

    // Usunięcie starych atrybutów i dodanie nowych
    await db
      .delete(recipeAttributes)
      .where(eq(recipeAttributes.recipeId, recipe.id));

    if (recipe.attributes.length > 0) {
      const attributesBatch: RecipeAttributeInsert[] = recipe.attributes.map(
        (attr) => ({
          recipeId: recipe.id!,
          attributeId: attr,
        })
      );
      await db.insert(recipeAttributes).values(attributesBatch);
    }

    return {
      success: true,
      id: recipe.id,
      slug: existingRecipe.slug,
    };
  } catch (error) {
    console.error("Błąd podczas aktualizacji przepisu:", error);
    return {
      success: false,
      error: "Wystąpił błąd podczas aktualizacji przepisu",
    };
  }
}
