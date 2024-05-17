"use server";

import { PAGINATION_ITEMS_PER_PAGE } from "@/config";
import { db } from "@/lib/db";
import {
  category as categoryDb,
  ingredient,
  preparationStep,
  recipe as recipeDB,
} from "@/lib/db/schema";
import { delay } from "@/lib/utils";
import { and, count, eq } from "drizzle-orm";

export const getRecipe = async (slug: string) => {
  const recipe = await db.query.recipe.findFirst({
    where: and(eq(recipeDB.slug, slug), eq(recipeDB.published, true)),
    with: {
      user: true,
      category: true,
    },
  });

  return recipe;
};

export const getUnpublishedRecipesCount = async (userId: string) => {
  const recipes = await db
    .select({ count: count() })
    .from(recipeDB)
    .where(and(eq(recipeDB.userId, userId), eq(recipeDB.published, false)));

  return recipes[0].count;
};

export const getRecipesCount = async (userId: string) => {
  const recipes = await db
    .select({ count: count() })
    .from(recipeDB)
    .where(eq(recipeDB.userId, userId));

  return recipes[0].count;
};

export const getIngredients = async (recipeId: number) => {
  const ingredients = await db.query.ingredient.findMany({
    where: eq(ingredient.recipeId, recipeId),
  });

  return ingredients;
};

export const getSteps = async (recipeId: number) => {
  const ingredients = await db.query.preparationStep.findMany({
    where: eq(preparationStep.recipeId, recipeId),
  });

  return ingredients;
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await db.query.category.findFirst({
    where: eq(categoryDb.slug, slug),
  });

  return category;
};

export const countRecipesByCategory = async (categoryId: number) => {
  const recipesCount = await db
    .select({ count: count() })
    .from(recipeDB)
    .where(eq(recipeDB.categoryId, categoryId));

  return recipesCount[0].count;
};

export const getNewestRecipes = async () => {
  const recipes = await db.recipe.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        select: {
          slug: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    take: 6,
  });
  return recipes;
};

export const getRecipesByCategory = async (
  categoryId: string,
  orderBy: "desc" | "asc",
  currentPage: number,
) => {
  const recipes = await db.recipe.findMany({
    where: {
      categoryId,
      published: true,
    },
    orderBy: {
      createdAt: orderBy,
    },
    include: {
      category: {
        select: {
          slug: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    take: PAGINATION_ITEMS_PER_PAGE,
    skip: (currentPage - 1) * PAGINATION_ITEMS_PER_PAGE,
  });

  return recipes;
};
