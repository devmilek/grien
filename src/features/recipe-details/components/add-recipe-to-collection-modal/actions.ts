"use server";

import { getCurrentSession } from "@/lib/auth/utils";
import db from "@/db";
import {
  collections,
  collectionsRecipes,
  favouriteRecipes,
} from "@/db/schema/collections";
import { and, desc, eq, getTableColumns } from "drizzle-orm";

export const getUserCollections = async ({
  recipeId,
}: {
  recipeId: string;
}) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      favouritesCount: 0,
      collections: [],
      recipesSavedInCollections: [],
      isFavourite: false,
    };
  }

  try {
    const userCollections = await db
      .select({
        ...getTableColumns(collections),
        recipesCount: db.$count(
          collectionsRecipes,
          eq(collectionsRecipes.collectionId, collections.id)
        ),
      })
      .from(collections)
      .where(eq(collections.userId, user.id))
      .orderBy(desc(collections.updatedAt));

    const favouritesCount = await db.$count(
      favouriteRecipes,
      eq(favouriteRecipes.userId, user.id)
    );

    const recipesSavedInCollections =
      await db.query.collectionsRecipes.findMany({
        where: eq(collectionsRecipes.recipeId, recipeId),
      });

    const isFavourite = await db.query.favouriteRecipes.findFirst({
      where: and(
        eq(favouriteRecipes.userId, user.id),
        eq(favouriteRecipes.recipeId, recipeId)
      ),
    });

    return {
      favouritesCount: favouritesCount,
      collections: userCollections,
      recipesSavedInCollections: recipesSavedInCollections.map(
        (collection) => collection.collectionId
      ),
      isFavourite: !!isFavourite,
    };
  } catch (e) {
    console.error(e);
    return {
      favouritesCount: 0,
      collections: [],
      recipesSavedInCollections: [],
      isFavourite: false,
    };
  }
};
