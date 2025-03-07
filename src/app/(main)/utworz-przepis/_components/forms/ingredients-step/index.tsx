import React from "react";
import IngredientForm from "./ingredient-form";
import IngredientsList from "./ingredients-list";

const IngredientsStep = () => {
  return (
    <div>
      <IngredientForm />
      <IngredientsList />
    </div>
  );
};

export default IngredientsStep;
