"use server";

import db from "@/db";
import { recipes } from "@/db/schema";
import { and, ilike, isNotNull, or } from "drizzle-orm";

export const navbarSearchRecipes = async (query?: string) => {
  if (!query) return [];

  const data = await db.query.recipes.findMany({
    limit: 10,
    with: {
      image: true,
      category: true,
      user: {
        columns: {
          name: true,
          username: true,
        },
      },
    },
    where: and(
      isNotNull(recipes.imageId),
      or(
        ilike(recipes.name, `%${query}%`),
        ilike(recipes.description, `%${query}%`)
      )
    ),
  });

  return data;
};
