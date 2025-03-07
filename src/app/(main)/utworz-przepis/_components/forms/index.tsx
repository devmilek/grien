"use client";

import React from "react";
import { useRecipe } from "../../context";
import BasicsForm from "./basics-form";
import IngredientsStep from "./ingredients-step";

const FormsView = () => {
  const { currentStep } = useRecipe();
  return (
    <div className="container">
      {currentStep === "basics" && <BasicsForm />}
      {currentStep === "ingredients" && <IngredientsStep />}
      {currentStep === "steps" && <div />}
    </div>
  );
};

export default FormsView;
