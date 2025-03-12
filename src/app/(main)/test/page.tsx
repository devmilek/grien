import RecipesFeed from "@/features/recipes-feed/components/recipes-feed";
import React from "react";

const RecipesPage = () => {
  return (
    <div>
      <RecipesFeed categorySlug="dania-glowne" />
    </div>
  );
};

export default RecipesPage;
