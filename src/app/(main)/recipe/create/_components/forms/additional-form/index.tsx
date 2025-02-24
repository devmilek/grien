"use client";

import { getCuisines, getDiets, getOccasions } from "@/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useQueries } from "@tanstack/react-query";
import React from "react";
import { RecipeAttributeType, useRecipeStore } from "../../use-recipe-store";
import { ChevronLeft, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  recipeBasicsSchema,
  recipeIngredientSchema,
  recipeStepSchema,
} from "../schema";
import { toast } from "sonner";

const AdditionalForm = () => {
  const {
    attributes,
    addAttribute,
    removeAttribute,
    setCurrentStep,
    basics,
    ingredients,
    preparationSteps,
  } = useRecipeStore();
  const { pending, data } = useQueries({
    queries: [
      {
        queryKey: ["occasions"],
        queryFn: async () => await getOccasions(),
      },
      {
        queryKey: ["cuisines"],
        queryFn: async () => await getCuisines(),
      },
      {
        queryKey: ["diets"],
        queryFn: async () => await getDiets(),
      },
    ],
    combine: (results) => {
      const [occasions, cuisines, diets] = results.map((result) => result.data);
      return {
        // data: {
        //   occasions,
        //   cuisines,
        //   diets,
        // },
        data: [
          {
            name: "Okazje",
            key: "occasions",
            items: occasions,
          },
          {
            name: "Kuchnie",
            key: "cuisines",
            items: cuisines,
          },
          {
            name: "Diety",
            key: "diets",
            items: diets,
          },
        ],
        pending: results.some((result) => result.isPending),
      };
    },
  });

  const handlePublish = () => {
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
      <h2 className="font-display text-3xl mb-4">Dodatkowe informacje</h2>
      <div className="gap-4 grid p-6 rounded-xl bg-white">
        {pending && (
          <div className="w-full p-8 flex justify-center">
            <Loader2Icon className="animate-spin size-4" />
          </div>
        )}
        {data.map((group) => (
          <div key={group.key}>
            <h3 className="text-lg font-semibold mb-4">{group.name}</h3>
            <div className="grid grid-cols-3 gap-4">
              {group?.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={item.id}
                    checked={attributes.some(
                      (attribute) => attribute.id === item.id
                    )}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addAttribute({
                          type: group.key as RecipeAttributeType,
                          id: item.id,
                        });
                      } else {
                        removeAttribute(item.id);
                      }
                    }}
                  />
                  <label
                    htmlFor={item.id}
                    className="font-medium text-sm leading-none"
                  >
                    {item.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full justify-between flex items-center mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentStep("steps")}
        >
          <ChevronLeft />
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">Zapisz jako szkic</Button>
          <Button variant="default" onClick={() => handlePublish()}>
            Opublikuj
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalForm;
