"use client";

import {
  addAttribute,
  removeAttribute,
} from "@/actions/recipe-creation/recipe-attribute";
import { useUtilityData } from "@/components/providers/utility-data-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { attributesToRecipes } from "@/lib/db/schema";
import React, { useState, useTransition } from "react";

const AttributesForm = ({
  recipeId,
  selectedAttributes,
}: {
  recipeId: number;
  selectedAttributes: (typeof attributesToRecipes.$inferSelect)[];
}) => {
  const { attributes } = useUtilityData();
  const [isPending, startTransition] = useTransition();
  const items = [
    {
      title: "Okazje",
      items: attributes?.filter((attr) => attr.type === "occasion"),
    },
    {
      title: "Kuchnie świata",
      items: attributes?.filter((attr) => attr.type === "cuisine"),
    },
    {
      title: "Diety",
      items: attributes?.filter((attr) => attr.type === "diet"),
    },
  ];

  const handleCheckedChange = (attributeId: number, checked: boolean) => {
    startTransition(async () => {
      if (checked) {
        await addAttribute(recipeId, attributeId);
      } else {
        await removeAttribute(recipeId, attributeId);
      }
    });
  };

  return (
    <div className="space-y-8 mt-10">
      {items.map((item) => (
        <div key={item.title}>
          <h2 className="font-display text-2xl mb-6">{item.title}</h2>
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            {item.items.map((attribute) => (
              <div className="flex items-center space-x-2" key={attribute.id}>
                <Checkbox
                  disabled={isPending}
                  checked={selectedAttributes.some(
                    (attr) => attr.attributeId === attribute.id,
                  )}
                  id={attribute.id.toString()}
                  onCheckedChange={(checked) => {
                    handleCheckedChange(attribute.id, !!checked);
                  }}
                />
                <label
                  htmlFor={attribute.id.toString()}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {attribute.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttributesForm;
