"use client";

import {
  Attribute,
  Image,
  Licence,
  Recipe,
  RecipeAttribute,
  RecipeIngredient,
  RecipeStep,
  User,
} from "@/db/schema";
import React, { createContext, useContext, ReactNode } from "react";

type ContextRecipe = Recipe & {
  user: User;
  ingredients: RecipeIngredient[];
  steps: (RecipeStep & {
    image: Image | null;
  })[];
  licence: Licence | null;
  attributes: (RecipeAttribute & {
    attribute: Attribute;
  })[];
  image: {
    url: string;
  };
};

interface RecipeDetailsContextType {
  recipe: ContextRecipe;
}

const RecipeDetailsContext = createContext<
  RecipeDetailsContextType | undefined
>(undefined);

interface RecipeDetailsProviderProps {
  children: ReactNode;
  recipe: ContextRecipe;
}

export const RecipeDetailsProvider = ({
  children,
  recipe,
}: RecipeDetailsProviderProps) => {
  return (
    <RecipeDetailsContext.Provider value={{ recipe }}>
      {children}
    </RecipeDetailsContext.Provider>
  );
};

export const useRecipeDetails = (): RecipeDetailsContextType => {
  const context = useContext(RecipeDetailsContext);

  if (context === undefined) {
    throw new Error(
      "useRecipeDetailsContext must be used within a RecipeDetailsProvider"
    );
  }

  return context;
};
