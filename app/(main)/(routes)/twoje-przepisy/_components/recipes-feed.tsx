import React from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PAGINATION_ITEMS_PER_PAGE } from "@/config";
import { RecipeCard, RecipeCardSkeleton } from "./recipe-card";
import Pagination from "@/components/pagination";
import { auth } from "@/lib/auth";
import { getRecipesCount } from "@/data";
import EmptyState from "@/components/empty-state";
import { recipe } from "@/lib/db/schema";
import { asc, desc, eq } from "drizzle-orm";

interface RecipesFeedProps {
  currentPage: number;
  sortOrder: "asc" | "desc";
}

const RecipesFeed = async ({ currentPage, sortOrder }: RecipesFeedProps) => {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  const skip = (currentPage - 1) * PAGINATION_ITEMS_PER_PAGE;

  const totalRecipes = await getRecipesCount(session.user.id);

  const orderBy =
    sortOrder === "asc" ? asc(recipe.createdAt) : desc(recipe.createdAt);

  const recipes = await db.query.recipe.findMany({
    where: eq(recipe.userId, session.user.id),
    orderBy,
    limit: PAGINATION_ITEMS_PER_PAGE,
    offset: skip,
  });

  const totalPages = Math.ceil(totalRecipes / PAGINATION_ITEMS_PER_PAGE);

  if (recipes.length === 0) {
    return (
      <div className="flex items-center p-8 bg-white rounded-xl justify-center text-center">
        <EmptyState description="Nie utworzyłeś jeszcze żadnych przepisów" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-3 mb-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <Pagination totalPages={totalPages} />
    </>
  );
};

const RecipesFeedSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(PAGINATION_ITEMS_PER_PAGE)].map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
};

export { RecipesFeed, RecipesFeedSkeleton };
