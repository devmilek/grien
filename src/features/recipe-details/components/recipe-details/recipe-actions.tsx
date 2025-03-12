"use client";

import React from "react";
import CookingModeModal from "../cooking-mode-modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HeartIcon, ShareIcon } from "lucide-react";
import AddRecipeToCollectionModal from "../add-recipe-to-collection-modal";
import { Image, Recipe, RecipeStep } from "@/db/schema";
import { toast } from "sonner";

const RecipeActions = ({
  recipe,
  likes,
  steps,
  userId,
}: {
  recipe: Recipe;
  steps: (RecipeStep & {
    image: Image | null;
  })[];
  likes: number;
  userId?: string | null;
}) => {
  const isOwner = userId && userId === recipe.userId;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: recipe.name,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Skopiowano link do schowka");
    }
  };

  return (
    <div className="border-t pt-2 flex gap-2 justify-between flex-col sm:flex-row mt-4">
      <div className="space-x-2 flex">
        <CookingModeModal steps={steps} />
        {isOwner ? (
          <Button variant="outline" asChild>
            <Link href={`/utworz-przepis/${recipe.slug}`}>Edytuj</Link>
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">
                <HeartIcon />
                {likes}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Polub przepis</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="space-x-2 flex">
        {userId && <AddRecipeToCollectionModal recipeId={recipe.id} />}

        <Button variant="ghost" onClick={handleShare}>
          <ShareIcon />
          Udostępnij
        </Button>
      </div>
    </div>
  );
};

export default RecipeActions;
