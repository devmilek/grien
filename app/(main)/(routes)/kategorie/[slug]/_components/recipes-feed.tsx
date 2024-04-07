import React from "react";
import { db } from "@/lib/db";
import { PAGINATION_ITEMS_PER_PAGE } from "@/constants";
import { HorizontalCard } from "@/components/cards/horizontal-card";
import { delay } from "@/lib/utils";

interface RecipesFeedProps {
  categoryId: string;
  orderBy: "asc" | "desc";
  currentPage: number;
}

const RecipesFeed = async ({
  categoryId,
  orderBy,
  currentPage,
}: RecipesFeedProps) => {
  const recipes = await db.recipe.findMany({
    where: {
      categoryId,
      published: true,
    },
    orderBy: {
      createdAt: orderBy,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
    take: PAGINATION_ITEMS_PER_PAGE,
    skip: (currentPage - 1) * PAGINATION_ITEMS_PER_PAGE,
  });
  return (
    <div className="space-y-6 mb-6">
      {recipes.map((recipe) => (
        <HorizontalCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipesFeed;
