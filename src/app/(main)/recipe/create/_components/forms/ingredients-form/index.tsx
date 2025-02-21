"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import IngredientsList from "./ingredients-list";
import { ChevronLeft } from "lucide-react";
import IngredientForm from "./ingredient-form";

const IngredientsForm = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="font-display text-3xl">Składniki</h2>
      <IngredientForm />
      <IngredientsList />
      <div className="w-full justify-between flex items-center mt-4">
        <Button variant="outline" size="icon">
          <ChevronLeft />
        </Button>
        <Button variant="default">Dalej</Button>
      </div>
    </div>
  );
};

export default IngredientsForm;
