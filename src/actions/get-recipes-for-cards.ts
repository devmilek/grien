import db from "@/db";
import { categories, Licence, Recipe } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export type RecipeForCard = Recipe & {
  category: {
    name: string;
    slug: string;
  };
  image: {
    url: string;
    licence: Licence | null;
  };
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
    where: and(categorySlug ? eq(categories.slug, categorySlug) : undefined),
    limit,
  });

  return data;
}
