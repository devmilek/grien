"use client";

import React from "react";
import BasicsForm from "./forms/basics-form";
import { Step, useRecipeStore } from "./use-recipe-store";
import IngredientsForm from "./forms/ingredients-form";
import StepsForm from "./forms/steps-form";
import { Carrot, ListCheck, Notebook, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import AdditionalForm from "./forms/additional-form";
import {
  Recipe,
  RecipeCuisine,
  RecipeDiet,
  RecipeIngredient,
  RecipeOccasion,
  RecipeStep,
} from "@/db/schema";

const steps = [
  {
    title: "Podstawy",
    description: "Podstawowe informacje",
    icon: Notebook,
    step: "basics",
  },
  {
    title: "Składniki",
    description: "Lista składników",
    icon: Carrot,
    step: "ingredients",
  },
  {
    title: "Kroki",
    description: "Niezbędne kroki",
    icon: ListCheck,
    step: "steps",
  },
  {
    title: "Dodatkowe informacje",
    description: "Więcej informacji",
    icon: Sparkles,
    step: "additional",
  },
];

const Stepper = ({
  data,
}: {
  data?: {
    recipe: Recipe;
    ingredients: RecipeIngredient[];
    steps: RecipeStep[];
    occasions: RecipeOccasion[];
    diets: RecipeDiet[];
    cuisines: RecipeCuisine[];
  };
}) => {
  const {
    currentStep,
    setCurrentStep,
    setBasics,
    setIngredients,
    setPreparationSteps,
    setAttributes,
    setId,
  } = useRecipeStore();

  React.useEffect(() => {
    if (data) {
      const { recipe, ingredients } = data;

      setId(recipe.id);

      setBasics({
        name: recipe.name,
        description: recipe.description,
        difficulty: recipe.difficulty,
        preparationTime: recipe.preparationTime,
        portions: recipe.portions,
        categoryId: recipe.categoryId,
      });

      setIngredients(
        ingredients.map((ingredient) => ({
          id: ingredient.id,
          name: ingredient.ingredient,
          amount: ingredient.amount ? parseFloat(ingredient.amount) : 0, // Provide default 0 for null
          unit: ingredient.unit ?? "", // Provide default empty string for null
        }))
      );

      setPreparationSteps(
        data.steps.map((step) => ({
          description: step.content,
          imageId: step.imageId ?? undefined,
          id: step.id,
        }))
      );

      setAttributes([
        ...data.occasions.map((occasion) => ({
          id: occasion.occasionId,
          type: "occasion" as const, // Add 'as const' to narrow the type
        })),
        ...data.diets.map((diet) => ({
          id: diet.dietId,
          type: "diet" as const,
        })),
        ...data.cuisines.map((cuisine) => ({
          id: cuisine.cuisineId,
          type: "cuisine" as const,
        })),
      ]);
    }
  }, []);

  return (
    <div className="mx-auto">
      <div className="gap-4 mb-10 w-full border p-4 rounded-xl bg-background items-center flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => setCurrentStep(step.step as Step)}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "size-10 bg-primary/10 text-primary shrink-0 flex items-center justify-center rounded-full transition-colors",
                  {
                    "text-white bg-primary": currentStep === step.step,
                  }
                )}
              >
                <step.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-nowrap">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-nowrap">
                  {step.description}
                </p>
              </div>
            </div>
            {/* <div className="h-1 rounded-full w-full bg-foreground/5 mt-3" /> */}
          </div>
        ))}
      </div>
      <div className="max-w-5xl mx-auto">
        <div>{currentStep === "basics" && <BasicsForm />}</div>
        <div>{currentStep === "ingredients" && <IngredientsForm />}</div>
        <div>{currentStep === "steps" && <StepsForm />}</div>
        <div>{currentStep === "additional" && <AdditionalForm />}</div>
      </div>
    </div>
  );
};

export default Stepper;
