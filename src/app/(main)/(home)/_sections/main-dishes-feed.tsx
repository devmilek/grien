import React from "react";
import HorizontalCard from "@/components/cards/horizontal-card";
import { getRecipesForCards } from "@/actions/get-recipes-for-cards";

const MainDishesFeed = async () => {
  const data = await getRecipesForCards({
    limit: 5,
    categorySlug: "dania-glowne",
  });
  return (
    <div className="p-6 rounded-xl bg-white">
      <h2 className="text-3xl mb-6 font-display">Dania głowne</h2>
      <div className="grid gap-8 md:gap-4">
        {data.map((recipe) => (
          <HorizontalCard key={recipe.id} {...recipe} />
        ))}
      </div>
    </div>
  );
};

export default MainDishesFeed;
