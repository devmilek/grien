"use server";

import db from "@/db";
import { categories, images, licences, recipes, users } from "@/db/schema";
import { asc, eq, getTableColumns } from "drizzle-orm";

export async function getInfiniteScrollRecipes(page: number, userId: string) {
  const data = await db
    .select({
      ...getTableColumns(recipes),
      category: {
        name: categories.name,
        slug: categories.slug,
      },
      imageSrc: images.url,
      licence: {
        ...getTableColumns(licences),
      },
      user: {
        name: users.name,
        username: users.username,
        image: users.image,
      },
    })
    .from(recipes)
    .innerJoin(images, eq(recipes.imageId, images.id))
    .innerJoin(users, eq(recipes.userId, users.id))
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
    .leftJoin(licences, eq(recipes.licenceId, licences.id))
    .limit(12)
    .where(eq(recipes.userId, userId))
    .offset(page * 12)
    .orderBy(asc(recipes.createdAt));

  return data;
}
