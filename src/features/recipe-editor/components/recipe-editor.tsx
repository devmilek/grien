import React from "react";
import FormsView from "./forms";
import RecipeStepper from "./recipe-stepper";
import { RecipeInitializer } from "../context/use-recipe-context";
import { ContextRecipe } from "../types";

const RecipeEditor = ({ recipe }: { recipe?: ContextRecipe | undefined }) => {
  return (
    <div>
      <RecipeInitializer initialRecipe={recipe}>
        <RecipeStepper />
        <FormsView />
      </RecipeInitializer>
    </div>
  );
};

export default RecipeEditor;
