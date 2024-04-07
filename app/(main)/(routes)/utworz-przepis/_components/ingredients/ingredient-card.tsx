"use client";

import { Button } from "@/components/ui/button";
import { Ingredient } from "@prisma/client";
import axios from "axios";
import { Loader2, XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface IngredientCardProps {
  ingredient: Ingredient;
  deleteIngredient: (ingredientId: string) => void;
}

const IngredientCard = ({
  ingredient,
  deleteIngredient,
}: IngredientCardProps) => {
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
          deleteIngredient(ingredient.id);
        }}
        size="icon"
        className="ml-auto"
        variant="ghost"
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default IngredientCard;
