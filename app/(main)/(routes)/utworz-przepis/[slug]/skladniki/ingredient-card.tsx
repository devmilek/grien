"use client";

import { deleteIngredient } from "@/actions/recipe-creation/ingredients";
import { Button } from "@/components/ui/button";
import { ingredient as dbIngredient } from "@/lib/db/schema";
import { Loader2, XIcon } from "lucide-react";
import { useTransition } from "react";

const IngredientCard = ({
  ingredient,
}: {
  ingredient: typeof dbIngredient.$inferSelect;
}) => {
  const [isPending, startTransition] = useTransition();
  return (
    <div
      className="px-4 py-2 rounded-xl bg-white text-sm flex items-center border"
      key={ingredient.id}
    >
      <p>
        <strong className="font-medium">
          {ingredient.quantity} {ingredient.unit}
        </strong>{" "}
        {ingredient.name}
      </p>
      <Button
        onClick={() => {
          startTransition(async () => {
            await deleteIngredient(ingredient.id);
          });
        }}
        size="icon"
        className="ml-auto"
        variant="ghost"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <XIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default IngredientCard;
