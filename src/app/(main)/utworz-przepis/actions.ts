"use server";

import {
  recipes,
  recipeIngredients,
  recipeSteps,
  RecipeIngredientInsert,
  RecipeStepInsert,
  RecipeAttributeInsert,
  recipeAttributes,
} from "@/db/schema";
import { Recipe } from "./context";
import { v4 as uuidv4 } from "uuid";
import { getCurrentSession } from "@/lib/auth/utils";
import db from "@/db";
import { slugifyWithCounter } from "@sindresorhus/slugify";
import { eq } from "drizzle-orm";

// Typ zwracany przez wszystkie akcje
type ActionResult = {
  success: boolean;
  error?: string;
  id?: string;
  slug?: string;
};

/**
 * Tworzy nowy przepis w bazie danych
 */
export async function createRecipe(recipe: Recipe): Promise<ActionResult> {
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

/**
 * Aktualizuje istniejący przepis
 */
export async function updateRecipe(recipe: Recipe): Promise<ActionResult> {
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

/**
 * Pobiera pełne dane przepisu
 */
// export async function getRecipe(id: string): Promise<Recipe | null> {
//   try {
//     // Pobierz podstawowe dane przepisu
//     const recipeData = await db.query.recipes.findFirst({
//       where: (recipes, { eq }) => eq(recipes.id, id),
//       with: {
//         ingredients: true,
//         steps: {
//           orderBy: (steps, { asc }) => [asc(steps.orderIndex)],
//         },
//       },
//     });

//     if (!recipeData) {
//       return null;
//     }

//     // Przekształć dane z bazy na format Recipe
//     const recipe: Recipe = {
//       id: recipeData.id,
//       basics: {
//         name: recipeData.name,
//         description: recipeData.description,
//         difficulty: recipeData.difficulty,
//         preparationTime: recipeData.preparationTime,
//         portions: recipeData.portions,
//         imageId: recipeData.imageId || undefined,
//         categoryId: recipeData.categoryId,
//       },
//       ingredients: recipeData.ingredients.map((ingredient) => ({
//         id: ingredient.id,
//         name: ingredient.name,
//         amount: ingredient.amount,
//         unit: ingredient.unit || undefined,
//       })),
//       steps: recipeData.steps.map((step) => ({
//         id: step.id,
//         description: step.description,
//         imageId: step.imageId || undefined,
//       })),
//       attributes: recipeData.attributes,
//       status: recipeData.status,
//     };

//     return recipe;
//   } catch (error) {
//     console.error("Błąd podczas pobierania przepisu:", error);
//     return null;
//   }
// }

/**
 * Usuwa przepis
 */
export async function deleteRecipe(id: string): Promise<ActionResult> {
  try {
    // Sprawdzenie autoryzacji
    const { session, user } = await getCurrentSession();

    if (!session || !user) {
      return {
        success: false,
        error: "Musisz być zalogowany, aby usunąć przepis",
      };
    }

    // Sprawdź, czy przepis należy do użytkownika
    const existingRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, id),
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
        error: "Nie masz uprawnień do usunięcia tego przepisu",
      };
    }

    // Usunięcie przepisu (kaskadowo usunie również składniki i kroki)
    await db.delete(recipes).where(eq(recipes.id, id));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Błąd podczas usuwania przepisu:", error);
    return {
      success: false,
      error: "Wystąpił błąd podczas usuwania przepisu",
    };
  }
}
