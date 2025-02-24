"use server";

import db from "@/db";
import { categories, images, recipes, users } from "@/db/schema";
import { asc, eq, getTableColumns } from "drizzle-orm";

export const getInfiniteScrollRecipes = async (page: number) => {
  console.log(page);
  const data = await db
    .select({
      ...getTableColumns(recipes),
      image: images.url,
      user: users.name,
      category: categories.name,
      categorySlug: categories.slug,
    })
    .from(recipes)
    .innerJoin(images, eq(recipes.imageId, images.id))
    .innerJoin(users, eq(recipes.userId, users.id))
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
    .limit(12)
    .offset(page * 12)
    .orderBy(asc(recipes.createdAt));

  return data;
};
