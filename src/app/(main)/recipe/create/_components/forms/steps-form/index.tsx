"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useRecipeStore } from "../../use-recipe-store";

const StepsForm = () => {
  const { setCurrentStep } = useRecipeStore();
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="font-display text-3xl">Kroki przygotowania</h2>
      {/* <IngredientForm /> */}
      {/* <IngredientsList /> */}
      <div className="w-full justify-between flex items-center mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentStep("ingredients")}
        >
          <ChevronLeft />
        </Button>
        <Button variant="default" onClick={() => setCurrentStep("steps")}>
          Dalej
        </Button>
      </div>
    </div>
  );
};

export default StepsForm;
