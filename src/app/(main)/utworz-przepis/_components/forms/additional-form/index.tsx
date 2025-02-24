"use client";

import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { useRecipeStore } from "../../use-recipe-store";
import { ChevronLeft, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  recipeBasicsSchema,
  recipeIngredientSchema,
  recipeStepSchema,
} from "../schema";
import { toast } from "sonner";
import { publishRecipe } from "@/actions/publish-recipe";
import { useRouter } from "next/navigation";
import { updateRecipe } from "@/actions/update-recipe";
import { useAttributes } from "@/hooks/use-attributes";

interface ValidationResult {
  isValid: boolean;
  step?: "basics" | "ingredients" | "steps";
  message?: string;
}

const AdditionalForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDraftSaving, setIsDraftSaving] = React.useState(false);
  const router = useRouter();
  const {
    attributes,
    addAttribute,
    removeAttribute,
    setCurrentStep,
    basics,
    ingredients,
    preparationSteps,
    id,
    reset,
  } = useRecipeStore();
  const { data, isLoading: pending } = useAttributes();

  const attributesData = [
    {
      name: "Kuchnie świata",
      items: data?.cuisines,
    },
    {
      name: "Okazje",
      items: data?.occasions,
    },
    {
      name: "Diety",
      items: data?.diets,
    },
  ];

  const validateRecipe = (): ValidationResult => {
    const validatedBasics = recipeBasicsSchema.safeParse(basics);
    if (!validatedBasics.success) {
      return {
        isValid: false,
        step: "basics",
        message: "Uzupełnij podstawowe informacje",
      };
    }

    if (
      !ingredients.length ||
      !recipeIngredientSchema.array().safeParse(ingredients).success
    ) {
      return {
        isValid: false,
        step: "ingredients",
        message: "Uzupełnij listę składników",
      };
    }

    if (
      !preparationSteps.length ||
      !recipeStepSchema.array().safeParse(preparationSteps).success
    ) {
      return {
        isValid: false,
        step: "steps",
        message: "Uzupełnij listę kroków",
      };
    }

    return { isValid: true };
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      const validation = validateRecipe();

      if (!validation.isValid) {
        toast.error(validation.message);
        setCurrentStep(validation.step!);
        return;
      }

      const {
        status,
        data: responseData,
        message,
      } = id
        ? await updateRecipe({
            id,
            basics,
            ingredients,
            preparationSteps,
            attributes,
          })
        : await publishRecipe({
            basics,
            ingredients,
            preparationSteps,
            attributes,
          });

      if (status === 200) {
        toast.success(message);
        reset();
        router.push(
          responseData?.slug ? `/${responseData.slug}` : "/moje-przepisy"
        );
      } else {
        throw new Error(message || "Wystąpił błąd");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Wystąpił nieoczekiwany błąd"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    // Implement draft saving logic here
    setIsDraftSaving(true);
    // ... draft saving code ...
    setIsDraftSaving(false);
  };

  return (
    <div role="form" aria-label="Dodatkowe informacje o przepisie">
      <h2 className="font-display text-3xl mb-4">Dodatkowe informacje</h2>
      <div className="gap-4 grid p-6 rounded-xl bg-white">
        {pending && (
          <div
            className="w-full p-8 flex justify-center"
            aria-label="Ładowanie"
          >
            <Loader2Icon className="animate-spin size-4" />
          </div>
        )}
        {attributesData.map((group, index) => (
          <div key={index} role="group" aria-labelledby={`group-${index}`}>
            <h3 id={`group-${index}`} className="text-lg font-semibold mb-4">
              {group.name}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {group?.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={item.id}
                    checked={attributes.some((attr) => attr.id === item.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addAttribute(item);
                      } else {
                        removeAttribute(item.id);
                      }
                    }}
                    aria-label={item.name}
                  />
                  <label
                    htmlFor={item.id}
                    className="font-medium text-sm leading-none cursor-pointer"
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
          disabled={isLoading || isDraftSaving}
          aria-label="Wróć do poprzedniego kroku"
        >
          <ChevronLeft />
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isLoading || isDraftSaving}
            onClick={handleSaveDraft}
          >
            {isDraftSaving ? "Zapisywanie..." : "Zapisz jako szkic"}
          </Button>
          <Button
            variant="default"
            disabled={isLoading || isDraftSaving}
            onClick={handlePublish}
          >
            {isLoading
              ? "Publikowanie..."
              : id
              ? "Zapisz i opublikuj"
              : "Opublikuj przepis"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalForm;
