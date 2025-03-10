import RecipeEditor from "@/features/recipe-editor/components/recipe-editor";
import { constructMetadata } from "@/utils/construct-metadata";
import React from "react";

export const metadata = constructMetadata({
  title: "Utwórz przepis",
  noIndex: true,
});

const CreateRecipePage = () => {
  return <RecipeEditor />;
};

export default CreateRecipePage;
