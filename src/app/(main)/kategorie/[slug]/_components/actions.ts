"use server";

import { getRecipesForCards } from "@/actions/get-recipes-for-cards";

export const getInfiniteScrollRecipes = async (
  pageParam: number,
  categorySlug: string
) => {
  const data = await getRecipesForCards({
    categorySlug,
    limit: 10,
    offset: pageParam * 10,
  });

  return data;
};
