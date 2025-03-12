import React from "react";
import FacatedSearch from "./facated-search";
import RecipesList from "./recipes-list";

const RecipesFeed = () => {
  return (
    <div className="container flex gap-8">
      <div className="w-2xs">
        <FacatedSearch />
      </div>
      <div className="flex-1">
        <RecipesList />
      </div>
    </div>
  );
};

export default RecipesFeed;
