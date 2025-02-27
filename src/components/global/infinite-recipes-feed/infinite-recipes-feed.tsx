"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { FileQuestion, Loader2Icon } from "lucide-react";
import HorizontalCard from "@/components/cards/horizontal-card";
import { getFilteredRecipes } from "@/actions/get-filtered-recipes";

export type RecipeFilterParams = {
  categorySlug?: string | null;
  userId?: string | null;
  searchQuery?: string;
  cuisineSlugs?: string[];
  dietSlugs?: string[];
  occassionSlugs?: string[];
  // Add other filter parameters as needed
};

interface InfiniteRecipesFeedProps {
  filterParams: RecipeFilterParams;
  showCategory?: boolean;
  title?: string;
}

const InfiniteRecipesFeed = ({
  filterParams,
  showCategory = true,
  title = "Przepisy",
}: InfiniteRecipesFeedProps) => {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["recipes", filterParams],
      queryFn: async ({ pageParam }) =>
        await getFilteredRecipes({
          page: pageParam,
          categorySlug: filterParams.categorySlug,
          cuisineSlugs: filterParams.cuisineSlugs,
          dietSlugs: filterParams.dietSlugs,
          occassionSlugs: filterParams.occassionSlugs,
          query: filterParams.searchQuery,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return lastPageParam + 1;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return (
    <div className="p-6 rounded-xl bg-white">
      {title && data?.pages[0].length !== 0 && (
        <h2 className="text-3xl font-display mb-6">{title}</h2>
      )}

      {data?.pages[0].length === 0 && (
        <div className="text-center pb-6">
          <FileQuestion className="text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold">Brak przepisów</p>
          <p className="text-sm text-muted-foreground">
            Nie znaleziono przepisów spełniających kryteria.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 sm:gap-6">
        {data?.pages.map((page, index) => (
          <Fragment key={index}>
            {page.map((recipe) => (
              <HorizontalCard
                key={recipe.id}
                {...recipe}
                showCategory={showCategory}
              />
            ))}
          </Fragment>
        ))}
      </div>

      {hasNextPage && (
        <div className="p-6 text-center flex justify-center pt-10" ref={ref}>
          <Loader2Icon className="size-4 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default InfiniteRecipesFeed;
