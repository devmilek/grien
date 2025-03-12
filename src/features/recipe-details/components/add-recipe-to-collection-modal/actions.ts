"use server";

import { getCurrentSession } from "@/lib/auth/utils";
import { createCollectionSchema, CreateCollectionSchema } from "./schema";
import db from "@/db";
import {
  collections,
  collectionsRecipes,
  favouriteRecipes,
} from "@/db/schema/collections";
import { slugifyWithCounter } from "@sindresorhus/slugify";
import { v4 as uuid } from "uuid";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { recipes } from "@/db/schema";

export const createCollection = async (data: CreateCollectionSchema) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      status: 401,
      message: "Nie jesteś zalogowany",
    };
  }

  const validatedData = createCollectionSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      status: 400,
      message: "Niepoprawne dane",
    };
  }

  const slugify = slugifyWithCounter();
  let recipeSlug = slugify(data.name);
  let isUnique = false;
  const collectionId = uuid();

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
        recipeSlug = slugify(data.name);
      }
    }

    await db.insert(collections).values({
      name: validatedData.data.name,
      public: validatedData.data.public,
      userId: user.id,
      slug: recipeSlug,
      id: collectionId,
    });

    return {
      status: 200,
      message: "Kolekcja została utworzona",
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: "Wystąpił błąd",
    };
  }
};

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
