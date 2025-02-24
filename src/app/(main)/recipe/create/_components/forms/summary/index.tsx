"use client";

import React from "react";
import { useRecipeStore } from "../../use-recipe-store";
import Image from "next/image";
import { getR2ImageSrc } from "@/utils";
import { Badge } from "@/components/ui/badge";
import {
  recipeBasicsSchema,
  recipeIngredientSchema,
  recipeStepSchema,
} from "../schema";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Summary = () => {
  const { basics, ingredients, preparationSteps, attributes, setCurrentStep } =
    useRecipeStore();

  const handlePublish = () => {
    console.log("Publishing recipe");

    const validatedBasics = recipeBasicsSchema.safeParse(basics);

    if (!validatedBasics.success) {
      toast.error("Uzupełnij podstawowe informacje");
      setCurrentStep("basics");
    }

    const validatedIngredients = recipeIngredientSchema
      .array()
      .safeParse(ingredients);

    if (!validatedIngredients.success || ingredients.length === 0) {
      toast.error("Uzupełnij listę składników");
      setCurrentStep("ingredients");
    }

    const validatedSteps = recipeStepSchema.array().safeParse(preparationSteps);

    if (!validatedSteps.success || preparationSteps.length === 0) {
      toast.error("Uzupełnij listę kroków");
      setCurrentStep("steps");
    }
  };

  return (
    <div>
      <h2 className="font-display text-3xl">Podsumowanie</h2>
      <div className="p-6 rounded-xl bg-white mt-4">
        {basics.imageId && (
          <Image
            unoptimized
            src={getR2ImageSrc(basics.imageId)}
            alt=""
            width={400}
            height={400}
            className="rounded-lg mx-auto max-w-72 w-full aspect-[4/3] object-cover"
          />
        )}
        <h1 className="font-display text-center mx-auto max-w-2xl text-xl mt-2">
          {basics.name || "Brak nazwy"}
        </h1>
        <p className="text-center mt-2 max-w-2xl mx-auto text-muted-foreground text-sm">
          {basics.description || "Brak opisu"}
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <Badge variant="outline">{ingredients.length} składników</Badge>
          <Badge variant="outline">
            {preparationSteps.length} kroków przygotowania
          </Badge>
          <Badge variant="outline">{attributes.length} atrybutów</Badge>
        </div>
        <div className="flex justify-end">
          <Button onClick={handlePublish}>Opublikuj</Button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
