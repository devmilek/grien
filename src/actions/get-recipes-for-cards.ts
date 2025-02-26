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
import { and, eq, getTableColumns } from "drizzle-orm";

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
}: {
  limit?: number;
  categorySlug?: string;
}): Promise<RecipeForCard[]> {
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
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
    .innerJoin(images, eq(recipes.imageId, images.id))
    .innerJoin(users, eq(recipes.userId, users.id))
    .leftJoin(licences, eq(recipes.licenceId, licences.id))
    .limit(limit)
    .where(categorySlug ? and(eq(categories.slug, categorySlug)) : undefined);

  return data;
}
