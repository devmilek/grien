"use client";

import { toggleFavouriteRecipe } from "@/actions/collections-recipes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeartIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const LikeRecipeButton = ({
  likesCount,
  recipeId,
  isLiked,
}: {
  likesCount: number;
  recipeId: string;
  isLiked: boolean;
}) => {
  const [liked, setLiked] = React.useState(isLiked);
  const [loading, setLoading] = React.useState(false);
  const [likes, setLikes] = useState(likesCount);

  const onClick = async () => {
    setLoading(true);
    const { message, status } = await toggleFavouriteRecipe(recipeId, !liked);

    if (status !== 200) {
      toast.error(message);
      setLoading(false);

      return;
    }

    toast.success(message);
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLoading(false);
  };

  return (
    <Button variant="ghost" onClick={onClick} disabled={loading}>
      <HeartIcon
        className={cn({
          "text-red-500 fill-red-500": liked,
        })}
      />
      {likes}
    </Button>
  );
};

export default LikeRecipeButton;
