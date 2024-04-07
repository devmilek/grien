import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Recipe } from "@prisma/client";
import { EyeIcon, ImageIcon, PenBox } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RemoveRecipeButton from "./remove-recipe-button";
import { Skeleton } from "@/components/ui/skeleton";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <div className="p-6 rounded-xl bg-white border flex items-center">
      {recipe.image ? (
        <Image
          alt="Recipe image"
          width={200}
          height={200}
          src={recipe.image}
          className="aspect-square w-52 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="aspect-square w-52 rounded-xl bg-gray-50 border flex items-center justify-center flex-shrink-0">
          <ImageIcon className="w-8 h-8 text-neutral-500" />
        </div>
      )}
      <div className="flex-1 ml-4 min-w-0">
        <Badge className="whitespace-nowrap mb-2" variant="secondary">
          {recipe.published ? "Opublikowany" : "Wersja robocza"}
        </Badge>
        <h1 className="font-display text-xl truncate">{recipe.name}</h1>
        <p className="text-sm text-neutral-500 mt-1 line-clamp-2 max-w-xl">
          {recipe.description}
        </p>
      </div>
      <div className="flex space-x-2 items-center">
        {recipe.published && (
          <Button variant="ghost" size="icon" asChild>
            <Link href={"/recipe/" + recipe.id}>
              <EyeIcon className="w-4 h-4" />
            </Link>
          </Button>
        )}
        <Button size="icon" asChild>
          <Link href={"/create-recipe/" + recipe.id}>
            <PenBox className="w-4 h-4" />
          </Link>
        </Button>
        {/* Remove button */}
        <RemoveRecipeButton id={recipe.id} />
      </div>
    </div>
  );
};

const RecipeCardSkeleton = () => {
  return (
    <div className="flex items-center p-6 bg-white border rounded-xl">
      <Skeleton className="aspect-square w-52 rounded-xl" />
      <div className="ml-4 flex-1">
        <Skeleton className="h-7 w-1/3" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
    </div>
  );
};

export { RecipeCard, RecipeCardSkeleton };
