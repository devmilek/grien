import React from "react";
import SmallHorizontCard from "@/components/cards/small-horizont-card";
import { getRecipesForCards } from "@/actions/get-recipes-for-cards";

const DrinksFeed = async () => {
  const data = await getRecipesForCards({
    limit: 5,
  });
  return (
    <div className="p-6 bg-white rounded-xl">
      <h3 className="text-2xl font-display">Napoje</h3>
      <div className="space-y-4 mt-4">
        {data.map((recipe) => (
          <SmallHorizontCard key={recipe.id} {...recipe} />
        ))}
      </div>
    </div>
  );
};

export default DrinksFeed;
