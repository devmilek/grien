import db from "@/db";
import {
  categories,
  images,
  Licence,
  licences,
  Recipe,
  recipes,
  users,
} from "@/db/schema";
import { and, desc, eq, getTableColumns } from "drizzle-orm";

export type RecipeForCard = Recipe & {
  category: {
    name: string;
    slug: string;
  };
  imageSrc: string;
  licence: Licence | null;
  user: {
    name: string;
    username: string | null;
    image: string | null;
  };
};

export async function getRecipesForCards({
  limit = 10,
  categorySlug,
  orderBy,
  userId,
  offset,
}: {
  limit?: number;
  categorySlug?: string;
  orderBy?: "newest";
  userId?: string;
  offset?: number;
}): Promise<RecipeForCard[]> {
  const orderByFilter = () => {
    switch (orderBy) {
      case "newest":
        return desc(recipes.createdAt);
      default:
        return undefined;
    }
  };

  // Create a query builder
  const query = db
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
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
    .innerJoin(images, eq(recipes.imageId, images.id))
    .innerJoin(users, eq(recipes.userId, users.id))
    .leftJoin(licences, eq(recipes.licenceId, licences.id))
    .where(
      and(
        eq(recipes.status, "published"),
        categorySlug ? eq(categories.slug, categorySlug) : undefined,
        userId ? eq(users.id, userId) : undefined
      )
    );

  // Apply orderBy conditionally
  const orderByValue = orderByFilter();
  if (orderByValue) {
    query.orderBy(orderByValue);
  }

  if (offset) {
    query.offset(offset);
  }

  if (limit) {
    query.limit(limit);
  }

  const data = await query;

  return data;
}
