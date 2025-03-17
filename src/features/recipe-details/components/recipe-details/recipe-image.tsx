"use client";

import ImageLicenceBadge from "@/components/global/image-licence-badge";
import Image from "next/image";
import React from "react";
import { useRecipeDetails } from "../../context/use-recipe-details-context";

const RecipeImage = () => {
  const { recipe } = useRecipeDetails();
  return (
    <div className="w-full relative aspect-[4/3] rounded-lg overflow-hidden">
      <Image fill alt="" src={recipe.image.url} className="object-cover" />
      {recipe.licence && (
        <ImageLicenceBadge
          licence={recipe.licence}
          className="absolute z-40 right-4 bottom-4 "
        />
      )}
    </div>
  );
};

export default RecipeImage;
