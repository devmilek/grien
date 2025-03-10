"use client";

import React from "react";
import { useRecipe } from "../../context";
import BasicsForm from "./basics-form";
import IngredientsStep from "./ingredients-step";
import StepsStep from "./steps-step";
import AdditionalStep from "./additional-step";

const FormsView = () => {
  const { currentStep } = useRecipe();
  return (
    <div className="container">
      {currentStep === "basics" && <BasicsForm />}
      {currentStep === "ingredients" && <IngredientsStep />}
      {currentStep === "steps" && <StepsStep />}
      {currentStep === "additional" && <AdditionalStep />}
    </div>
  );
};

export default FormsView;
