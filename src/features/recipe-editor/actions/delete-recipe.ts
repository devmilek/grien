"use server";

import { eq } from "drizzle-orm";
import { RecipeActionResult } from "../types";
import { recipes } from "@/db/schema";
import db from "@/db";
import { getCurrentSession } from "@/lib/auth/utils";

/**
 * Usuwa przepis
 */
export async function deleteRecipe(id: string): Promise<RecipeActionResult> {
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
