"use client";

import { checkIfSaved, saveRecipe, unsaveRecipe } from "@/actions/save-recipe";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const SaveRecipeButton = ({ recipeId }: { recipeId: string }) => {
  const [isSaved, setIsSaved] = useState(false);

  const onClick = async () => {
    const action = isSaved ? unsaveRecipe(recipeId) : saveRecipe(recipeId);
    toast.promise(
      async () => {
        await action;
        await fetchIsSaved();
      },
      {
        loading: "Zapisywanie przepisu...",
        success: "Przepis został zapisany",
        error: "Wystąpił błąd podczas zapisywania przepisu",
      },
    );
  };

  const fetchIsSaved = async () => {
    const saved = await checkIfSaved(recipeId);
    setIsSaved(saved);
  };

  useEffect(() => {
    fetchIsSaved();
  });

  return (
    <Button variant={isSaved ? "secondary" : "ghost"} onClick={onClick}>
      {isSaved ? (
        <BookmarkCheck className="h-4 w-4 mr-2" />
      ) : (
        <Bookmark className="h-4 w-4 mr-2" />
      )}
      {isSaved ? "Zapisano" : "Zapisz przepis"}
    </Button>
  );
};

export default SaveRecipeButton;
