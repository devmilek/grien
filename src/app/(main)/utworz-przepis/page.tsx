import React from "react";
import { RecipeInitializer } from "./context";
import FormsView from "./_components/forms";

const Page = () => {
  return (
    <RecipeInitializer>
      <FormsView />
    </RecipeInitializer>
  );
};

export default Page;
