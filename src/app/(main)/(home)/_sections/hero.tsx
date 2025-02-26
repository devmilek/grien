import { getRecipesForCards } from "@/actions/get-recipes-for-cards";
import ImageBackgroudCard from "@/components/cards/image-background-card";
import React from "react";

const HeroSection = async () => {
  const data = await getRecipesForCards({
    limit: 3,
  });

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
      {data.map((recipe) => (
        <ImageBackgroudCard key={recipe.id} {...recipe} />
      ))}
    </div>
  );
};

export default HeroSection;
