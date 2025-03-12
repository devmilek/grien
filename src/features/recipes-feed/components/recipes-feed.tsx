import React from "react";
import FacatedSearch from "./facated-search";
import RecipesList from "./recipes-list";
import { UseFilteredRecipesProps } from "../hooks/use-filtered-recipes";

const RecipesFeed = ({
  categorySlug,
  cuisineSlugs,
  dietsSlugs,
  occassionsSlug,
}: UseFilteredRecipesProps) => {
  return (
    <div className="container flex gap-8">
      <div className="w-2xs">
        <FacatedSearch
          showCategories={!categorySlug}
          showCuisines={!cuisineSlugs}
          showDiets={!dietsSlugs}
          showOccasions={!occassionsSlug}
        />
      </div>
      <div className="flex-1">
        <RecipesList
          categorySlug={categorySlug}
          cuisineSlugs={cuisineSlugs}
          dietsSlugs={dietsSlugs}
          occassionsSlug={occassionsSlug}
        />
      </div>
    </div>
  );
};

export default RecipesFeed;
