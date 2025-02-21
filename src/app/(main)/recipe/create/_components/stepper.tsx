"use client";

import React from "react";
import BasicsForm from "./forms/basics-form";
import { useRecipeStore } from "./use-recipe-store";
import IngredientsForm from "./forms/ingredients-form";

const steps = [
  {
    title: "Podstawowy",
    description: "Podstawowe informacje o przepisie",
  },
  {
    title: "Składniki",
    description: "Lista składników do wykonania przepisu",
  },
  {
    title: "Kroki",
    description: "Kroki niezbędne do wykonania przepisu",
  },
  {
    title: "Dodatkowe informacje",
    description: "Dodatkowe informacje o przepisie",
  },
];

const Stepper = () => {
  const { currentStep, setCurrentStep } = useRecipeStore();
  return (
    <div>
      {/* <div className="flex gap-4 mb-10">
        {steps.map((step, index) => (
          <div key={index} className="w-full">
            <h3 className="font-semibold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
            <div className="h-1 rounded-full w-full bg-foreground/5 mt-3" />
          </div>
        ))}
      </div> */}
      <div>{currentStep === "basics" && <BasicsForm />}</div>
      <div>{currentStep === "ingredients" && <IngredientsForm />}</div>
    </div>
  );
};

export default Stepper;
