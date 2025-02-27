"use client";

import React from "react";
import { useInfiniteSearchParams } from "./use-infinite-search-params";
import InfiniteRecipesFeed from "./infinite-recipes-feed";
import FacatedSearch from "../facated-search";

const InfiniteRecipes = ({
  categorySlug,
  cuisineSlugs,
  dietSlugs,
  occassionSlugs,
}: {
  categorySlug?: string;
  cuisineSlugs?: string[];
  dietSlugs?: string[];
  occassionSlugs?: string[];
}) => {
  const {
    categorySlug: categorySlugParam,
    cuisineSlugs: cuisineSlugsParam,
    dietSlugs: dietSlugsParam,
    occassionSlugs: occassionSlugsParam,
  } = useInfiniteSearchParams();
  return (
    <div className="flex mt-5 gap-6">
      <div className="w-[300px] shrink-0">
        <FacatedSearch
          showCategories={!categorySlug}
          showCuisines={!cuisineSlugs}
          showDiets={!dietSlugs}
          showOccasions={!occassionSlugs}
        />
      </div>
      <div className="flex-1">
        <InfiniteRecipesFeed
          filterParams={{
            categorySlug: categorySlug || categorySlugParam,
            cuisineSlugs: cuisineSlugs || cuisineSlugsParam,
            dietSlugs: dietSlugs || dietSlugsParam,
            occassionSlugs: occassionSlugs || occassionSlugsParam,
          }}
        />
      </div>
    </div>
  );
};

export default InfiniteRecipes;
