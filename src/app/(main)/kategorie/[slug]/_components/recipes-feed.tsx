"use client";

import React from "react";
import { useInfiniteSearchParams } from "@/components/global/infinite-recipes-feed/use-infinite-search-params";
import InfiniteRecipesFeed from "@/components/global/infinite-recipes-feed/infinite-recipes-feed";

const RecipesFeed = ({ categorySlug }: { categorySlug: string }) => {
  const { cuisineSlugs, dietSlugs, occassionSlugs } = useInfiniteSearchParams();

  return (
    <InfiniteRecipesFeed
      filterParams={{
        categorySlug,
        cuisineSlugs,
        dietSlugs,
        occassionSlugs,
      }}
    />
  );
};

export default RecipesFeed;
