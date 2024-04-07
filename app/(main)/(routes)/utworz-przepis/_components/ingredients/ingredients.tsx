"use client";

import React from "react";
import { useIngredients } from "@/hooks/use-ingredients";
import IngredientCard from "./ingredient-card";
import IngredientForm from "./ingredient-form";

const Ingredients = ({ recipeId }: { recipeId: string }) => {
  const { ingredients, mutateDeleteIngredient, isLoading } =
    useIngredients(recipeId);
  return (
    <>
      <div className="bg-white rounded-xl p-4 mb-8">
        <IngredientForm recipeId={recipeId} />
      </div>
      <div className="space-y-2">
        {ingredients?.map((ingredient) => (
          <IngredientCard
            key={ingredient.id}
            ingredient={ingredient}
            deleteIngredient={mutateDeleteIngredient}
          />
        ))}
      </div>
    </>
  );
};

export default Ingredients;
