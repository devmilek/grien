"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { RecipeIngredient } from "@/db/schema";
import { MinusIcon, PlusIcon } from "lucide-react";
import React from "react";

const IngredientsList = ({
  ingredients,
  portions,
}: {
  ingredients: RecipeIngredient[];
  portions: number;
}) => {
  const [currentPortions, setCurrentPortions] = React.useState(portions);

  const handleIncrement = () => setCurrentPortions((prev) => prev + 1);
  const handleDecrement = () =>
    setCurrentPortions((prev) => (prev > 1 ? prev - 1 : prev));

  const calculateAmount = (amount: number) => {
    const multiplier = currentPortions / portions;
    return Number((amount * multiplier).toFixed(2));
  };

  return (
    <div className="rounded-xl w-full bg-white p-6">
      <h3 className="font-display text-3xl">Składniki</h3>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground my-3">Porcje</p>
        <div className="flex h-8 overflow-hidden rounded-md border">
          <button
            className="aspect-square bg-accent flex items-center justify-center border-r cursor-pointer disabled:opacity-50"
            onClick={handleDecrement}
            disabled={currentPortions <= 1}
          >
            <MinusIcon className="size-4" />
          </button>
          <input
            className="size-8 outline-none text-center text-sm"
            readOnly
            value={currentPortions}
          />
          <button
            className="aspect-square bg-accent flex items-center justify-center border-l cursor-pointer"
            onClick={handleIncrement}
          >
            <PlusIcon className="size-4" />
          </button>
        </div>
      </div>
      <div>
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex items-center gap-4 py-4 border-b last:border-b-0 last:pb-0"
          >
            <Checkbox id={ingredient.id} />
            <label
              htmlFor={ingredient.id}
              className="text-sm font-medium capitalize"
            >
              {ingredient.name}
            </label>
            <p className="text-sm text-muted-foreground whitespace-nowrap ml-auto">
              {Number(ingredient.amount) > 0 &&
                calculateAmount(Number(ingredient.amount))}{" "}
              {ingredient.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsList;
