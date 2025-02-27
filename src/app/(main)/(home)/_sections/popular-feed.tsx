import React from "react";
import ImageBackgroudCard from "@/components/cards/image-background-card";
import { getRecipesForCards } from "@/actions/get-recipes-for-cards";
import { cn } from "@/lib/utils";

const PopularFeed = async () => {
  const data = await getRecipesForCards({
    limit: 3,
  });
  return (
    <div className="p-6 rounded-xl bg-white">
      <h2 className="font-display text-3xl mb-5">Najpopularniejsze</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {data.map((recipe, index) => (
          <ImageBackgroudCard
            key={index}
            {...recipe}
            className={cn(index === 0 ? "md:col-span-2" : "")}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularFeed;
