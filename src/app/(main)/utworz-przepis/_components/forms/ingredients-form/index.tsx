"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import IngredientsList from "./ingredients-list";
import { ChevronLeft } from "lucide-react";
import IngredientForm from "./ingredient-form";
import { useRecipeStore } from "../../use-recipe-store";

const IngredientsForm = () => {
  const { setCurrentStep } = useRecipeStore();
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="font-display text-3xl">Składniki</h2>
      <IngredientForm />
      <IngredientsList />
      <div className="w-full justify-between flex items-center mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentStep("basics")}
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

export default IngredientsForm;
