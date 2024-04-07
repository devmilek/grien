import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import CreateRecipeCard from "./_components/create-recipe-card";
import { RecipesFeed, RecipesFeedSkeleton } from "./_components/recipes-feed";
import SortButton from "@/components/sort-button";
import { getRecipesCount, getUnpublishedRecipesCount } from "@/data";
import { auth } from "@/lib/auth";

interface YourRecipesPageProps {
  searchParams?: {
    sortOrder?: "asc" | "desc";
    page?: string;
  };
}

const YourRecipesPage = async ({ searchParams }: YourRecipesPageProps) => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const userId = session.user.id;

  const unpublishedRecipesCount = await getUnpublishedRecipesCount(userId);
  const recipesCount = await getRecipesCount(userId);

  //TODO: Sort by published and unpublished
  //TODO: Create card suspence

  const currentPage = Number(searchParams?.page) || 1;

  const sortOrder = searchParams?.sortOrder || "asc";

  return (
    <section>
      <h1 className="font-display text-3xl mb-6">Twoje przepisy</h1>
      <div className="grid grid-cols sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl bg-white border">
          <p className="text-sm font-medium text-neutral-600">
            Łączna ilość postów
          </p>
          <h1 className="font-display text-3xl mt-1">{recipesCount}</h1>
        </div>

        <div className="p-6 rounded-xl bg-white border">
          <p className="text-sm font-medium text-neutral-600">Wersje robocze</p>
          <h1 className="font-display text-3xl mt-1">
            {unpublishedRecipesCount}
          </h1>
        </div>

        <CreateRecipeCard className="sm:col-span-2" />
      </div>
      <header className="flex items-center justify-between mt-16 mb-6">
        <h1 className="font-display text-3xl">Zarządzaj przepisami</h1>
        <SortButton />
      </header>
      <Suspense fallback={<RecipesFeedSkeleton />}>
        <RecipesFeed currentPage={currentPage} sortOrder={sortOrder} />
      </Suspense>
    </section>
  );
};

export default YourRecipesPage;
