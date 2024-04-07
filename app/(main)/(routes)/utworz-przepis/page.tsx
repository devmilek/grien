import React from "react";
import CreateRecipeForm from "./_components/create-recipe-form";

const CreateNewRecipePage = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 lg:p-12">
      <CreateRecipeForm />
    </div>
  );
};

export default CreateNewRecipePage;
