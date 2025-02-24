"use server";

import db from "@/db";
import { collectionsRecipes, favouriteRecipes } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/utils";
import { and, eq, notInArray } from "drizzle-orm";

export const addRecipeToCollections = async (
  recipeId: string,
  collectionIds: string[]
) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      status: 401,
      message: "Nie jesteś zalogowany",
    };
  }

  try {
    await db.transaction(async (trx) => {
      // Usuń nieaktualne powiązania
      await trx
        .delete(collectionsRecipes)
        .where(
          and(
            eq(collectionsRecipes.recipeId, recipeId),
            notInArray(collectionsRecipes.collectionId, collectionIds)
          )
        );

      // Dodaj nowe powiązania (z ignorowaniem istniejących)
      if (collectionIds.length > 0) {
        console.log({ collectionIds, recipeId });
        await trx
          .insert(collectionsRecipes)
          .values(
            collectionIds.map((collectionId) => ({
              collectionId,
              recipeId,
            }))
          )
          .onConflictDoNothing();
      }
    });

    return {
      status: 200,
      message: "Zapisano zmiany",
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: "Wystąpił błąd",
    };
  }
};

export const toggleFavouriteRecipe = async (
  recipeId: string,
  isFavourite: boolean
) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      status: 401,
      message: "Nie jesteś zalogowany",
    };
  }

  try {
    if (isFavourite) {
      await db
        .insert(favouriteRecipes)
        .values({ userId: user.id, recipeId })
        .onConflictDoNothing();
    } else {
      await db
        .delete(favouriteRecipes)
        .where(
          and(
            eq(favouriteRecipes.userId, user.id),
            eq(favouriteRecipes.recipeId, recipeId)
          )
        );
    }

    return {
      status: 200,
      message: isFavourite ? "Dodano do ulubionych" : "Usunięto z ulubionych",
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: "Wystąpił błąd",
    };
  }
};
