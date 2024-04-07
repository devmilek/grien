"use client";

import React from "react";
import { AdditionalSelect } from "./additional-select";
import { useRecipeAdditional } from "@/hooks/use-recipe-additional";

const OccasionsSelect = ({ recipeId }: { recipeId: string }) => {
  const {
    selectedOccasions,
    addOccasionMutation,
    removeOccasionMutation,
    unselectedOccasions,
    isCuisinesLoading,
  } = useRecipeAdditional(recipeId);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Okazje</h2>
      <AdditionalSelect
        selectedItems={selectedOccasions}
        unselectedItems={unselectedOccasions}
        addFn={addOccasionMutation}
        removeFn={removeOccasionMutation}
        placeholder="Wybierz okazje"
        disabled={isCuisinesLoading}
      />
    </div>
  );
};

export default OccasionsSelect;
