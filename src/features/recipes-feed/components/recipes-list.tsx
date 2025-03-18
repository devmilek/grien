"use client";

import React, { Fragment, useEffect } from "react";
import {
  useFilteredRecipes,
  UseFilteredRecipesProps,
} from "../hooks/use-filtered-recipes";
import { useInView } from "react-intersection-observer";
import { CookingPot, Loader2 } from "lucide-react";
import HorizontalCard from "@/components/cards/horizontal-card";
import SearchInput from "./search-input";
import MobileFacatedSearch from "./facated-search/mobile-facated-search";

const RecipesList = ({
  categorySlug,
  cuisineSlugs,
  dietsSlugs,
  occassionsSlug,
  username,
  query,
  collectionId,
}: UseFilteredRecipesProps) => {
  const { ref, inView } = useInView({
    threshold: 0.8,
  });
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
    useFilteredRecipes({
      categorySlug,
      cuisineSlugs,
      dietsSlugs,
      occassionsSlug,
      username,
      query,
      collectionId,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return (
    <section className="p-8 rounded-2xl bg-white">
      <header className="flex justify-between flex-col w-full items-start gap-4 sm:flex-row">
        <div className="flex items-center gap-3 flex-row-reverse justify-between w-full lg:flex-row lg:justify-start">
          <MobileFacatedSearch className="lg:hidden" />
          <h1 className="text-3xl font-display">Wyniki</h1>
        </div>
        {!query && <SearchInput className="w-full sm:w-max" />}
      </header>
      {isLoading && (
        <div className="p-4 pt-12 flex justify-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      )}
      {data?.pages[0].length === 0 && !isLoading && (
        <div className="text-center pt-8">
          <CookingPot className="size-6 mx-auto mb-4" />
          <p className="font-medium">Nie znaleziono przepisów</p>
          <p className="text-sm text-muted-foreground">
            Spróbuj zmienić kryteria wyszukiwania
          </p>
        </div>
      )}
      <div className="space-y-4 mt-6">
        {data?.pages.map((page, index) => (
          <Fragment key={index}>
            {page.map((item, itemIndex) => (
              <HorizontalCard
                key={itemIndex}
                {...item}
                createdAt={new Date(item.createdAt)}
                updatedAt={new Date(item.updatedAt)}
              />
            ))}
          </Fragment>
        ))}
      </div>
      {hasNextPage && (
        <div ref={ref}>
          {isFetchingNextPage && (
            <div className="p-4 pt-12 flex justify-center">
              <Loader2 className="size-4 animate-spin" />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default RecipesList;
