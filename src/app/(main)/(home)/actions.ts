"use server";

import { RecipeForCard } from "@/actions/get-recipes-for-cards";
import db from "@/db";
import { recipes } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function getInfiniteScrollRecipes(
  page: number
): Promise<RecipeForCard[]> {
  const data = await db.query.recipes.findMany({
    with: {
      category: {
        columns: {
          name: true,
          slug: true,
        },
      },
      image: {
        with: {
          licence: true,
        },
        columns: {
          url: true,
        },
      },
      licence: true,
      user: {
        columns: {
          name: true,
          username: true,
          image: true,
        },
      },
    },
    limit: 12,
    offset: page * 12,
    orderBy: asc(recipes.createdAt),
  });

  return data;
}
