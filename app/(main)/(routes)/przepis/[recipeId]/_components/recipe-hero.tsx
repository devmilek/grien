import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatMins } from "@/lib/utils";
import { difficultyMap } from "@/maps";
import { Category, Recipe, User } from "@prisma/client";
import { Clock, ChefHatIcon, Star, Share, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ShareRecipeButton from "./share-recipe-button";
import SaveRecipeButton from "./save-recipe-button";

interface RecipeHeroProps {
  recipe: Recipe & {
    user: User;
    category: Category | null;
  };
}

const RecipeHero = ({ recipe }: RecipeHeroProps) => {
  if (!recipe || !recipe.image) {
    return null;
  }
  return (
    <div className="bg-white flex flex-col md:flex-row p-4 lg:p-7 rounded-xl gap-x-8 items-center">
      <Image
        src={recipe.image}
        alt={recipe?.name}
        width={660}
        height={440}
        className="rounded-lg aspect-[4/3] w-full md:w-2/5 object-cover flex-shrink-0"
      />
      <div className="flex flex-col w-full">
        <h1 className="text-4xl font-display mt-4 lg:mt-0">{recipe.name}</h1>
        <div className="flex items-center space-x-3 mt-4">
          <Link
            href={""}
            className="flex items-center space-x-2 font-semibold text-sm "
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="uppercase text-[10px]">
                {recipe.user.name?.slice(0, 2)}
              </AvatarFallback>
              {recipe.user.image && <AvatarImage src={recipe.user.image} />}
            </Avatar>
            <p className="text-emerald-700">{recipe.user.name}</p>
          </Link>
          <span className="text-neutral-500">•</span>
          <p className="text-xs text-gray-500">
            {recipe.createdAt.toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Button size="xs" variant="outline">
            {recipe.category?.name}
          </Button>
          <Button size="xs" variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            {formatMins(recipe.preparationTime!)}
          </Button>
          <Button size="xs" variant="outline">
            <ChefHatIcon className="h-4 w-4 mr-2" />
            {difficultyMap[recipe.difficulty]}
          </Button>
          <Button size="xs" variant="outline">
            {recipe.servings} {recipe.servings > 1 ? "porcji" : "porcja"}
          </Button>
        </div>
        <p className="mt-6 leading-normal text-sm flex-1 pb-8 text-neutral-500">
          {recipe.description}
        </p>
        <div className="w-full flex items-center justify-between pt-3 border-t">
          <SaveRecipeButton recipeId={recipe.id} />
          <ShareRecipeButton recipeId={recipe.id} />
        </div>
      </div>
    </div>
  );
};

export default RecipeHero;
