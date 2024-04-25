import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/db";
import { Ingredient } from "@prisma/client";
import React from "react";

interface IngredientsFeedProps {
  ingredients: Ingredient[];
}

const IngredientsFeed = async ({ recipeId }: { recipeId: string }) => {
  const ingredients = await db.ingredient.findMany({
    where: {
      recipeId,
    },
  });
  return (
    <div className="bg-white p-8 rounded-xl flex-shrink-0">
      <h2 className="text-3xl font-display">Składniki</h2>
      <div className="mt-6">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex items-center space-x-2 py-4 border-b"
          >
            <Checkbox id={ingredient.id} />
            <Label
              className="font-medium leading-tight"
              htmlFor={ingredient.id}
            >
              {ingredient.quantity} {ingredient.unit}{" "}
              <span className="font-normal text-neutral-600">
                {ingredient.name}
              </span>
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsFeed;
