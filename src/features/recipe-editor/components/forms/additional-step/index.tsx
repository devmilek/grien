"use client";

import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { Loader2Icon } from "lucide-react";
import { useAttributes } from "@/hooks/use-attributes";
import { useRecipe } from "@/features/recipe-editor/context/use-recipe-context";

const AdditionalStep = () => {
  const { recipe, toggleAttribute } = useRecipe();
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

  return (
    <div
      role="form"
      aria-label="Dodatkowe informacje o przepisie"
      className="max-w-5xl mx-auto"
    >
      <h2 className="font-display text-3xl mb-4">Dodatkowe informacje</h2>
      <div className="gap-10 grid p-12 rounded-xl bg-white">
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
            <h3 id={`group-${index}`} className="text-xl font-semibold mb-6">
              {group.name}
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {group?.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={item.id}
                    checked={recipe.attributes.some((attr) => attr === item.id)}
                    onCheckedChange={() => {
                      toggleAttribute(item.id);
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
    </div>
  );
};

export default AdditionalStep;
