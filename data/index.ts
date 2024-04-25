"use server";

import { PAGINATION_ITEMS_PER_PAGE } from "@/config";
import { db } from "@/lib/db";
import { delay } from "@/lib/utils";

export const getUtilityData = async () => {
  console.log("GET UTILITY DATA");
  const [categories, occasions, cuisines, diets] = await db.$transaction([
    db.category.findMany({
      orderBy: {
        recipes: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: {
            recipes: true,
          },
        },
      },
    }),
    db.occasion.findMany(),
    db.cuisine.findMany(),
    db.diet.findMany(),
  ]);
  return { categories, occasions, cuisines, diets };
};

export const getRecipe = async (recipeId: string) => {
  console.log("GET RECIPE");
  const recipe = await db.recipe.findUnique({
    where: {
      id: recipeId,
    },
  });

  await delay(3000);

  return recipe;
};

export const getUnpublishedRecipesCount = async (userId: string) => {
  const recipes = await db.recipe.count({
    where: {
      userId: userId,
      published: false,
    },
  });

  return recipes;
};

export const getRecipesCount = async (userId: string) => {
  const recipesCount = await db.recipe.count({
    where: {
      userId: userId,
    },
  });

  return recipesCount;
};

export const getIngredients = async (recipeId: string) => {
  const ingredients = await db.ingredient.findMany({
    where: {
      recipeId: recipeId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return ingredients;
};

export const getSteps = async (recipeId: string) => {
  const steps = await db.preparationStep.findMany({
    where: {
      recipeId: recipeId,
    },
    orderBy: {
      position: "asc",
    },
  });

  return steps;
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
