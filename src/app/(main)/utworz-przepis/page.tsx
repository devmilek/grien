import React from "react";
import { RecipeInitializer } from "./context";
import FormsView from "./_components/forms";
import RecipeStepper from "./_components/recipe-stepper";

const Page = () => {
  return (
    <RecipeInitializer>
      <RecipeStepper />
      <FormsView />
    </RecipeInitializer>
  );
};

export default Page;
