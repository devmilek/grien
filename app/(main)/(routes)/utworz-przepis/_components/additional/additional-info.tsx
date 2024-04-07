"use client";

import React from "react";
import { useRecipeAdditional } from "@/hooks/use-recipe-additional";
import { AdditionalSelect } from "./additional-select";
import OccasionsSelect from "./occasions-select";

interface AdditionalInfoFormProps {
  recipeId: string;
}

const AdditionalInfo = ({ recipeId }: AdditionalInfoFormProps) => {
  const {
    isCuisinesLoading,
    selectedCuisines,
    addCuisineMutation,
    removeCuisineMutation,
    unselectedCuisines,

    isOccasionsLoading,
    selectedOccasions,
    addOccasionMutation,
    removeOccasionMutation,
    unselectedOccasions,

    isDietsLoading,
    selectedDiets,
    addDietMutation,
    removeDietMutation,
    unselectedDiets,
  } = useRecipeAdditional(recipeId);
  return (
    <div>
      <div className="p-8 rounded-xl bg-white space-y-12">
        <OccasionsSelect recipeId={recipeId} />
        <div>
          <h2 className="text-xl font-semibold mb-4">Kuchnie świata</h2>
          <AdditionalSelect
            selectedItems={selectedCuisines}
            unselectedItems={unselectedCuisines}
            addFn={addCuisineMutation}
            removeFn={removeCuisineMutation}
            placeholder="Wybierz kuchnie"
            disabled={isCuisinesLoading}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Diety</h2>
          <AdditionalSelect
            selectedItems={selectedDiets}
            unselectedItems={unselectedDiets}
            addFn={addDietMutation}
            removeFn={removeDietMutation}
            placeholder="Wybierz diety"
            disabled={isDietsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
