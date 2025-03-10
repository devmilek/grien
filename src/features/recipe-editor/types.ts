import { RecipeStatus } from "@/db/schema";
import { RecipeBasicsSchema } from "./schema/recipe-basics-schema";
import { RecipeIngredientSchema } from "./schema/recipe-ingredient-shema";
import { RecipeStepSchema } from "./schema/recipe-step-schema";

export type RecipeActionResult = {
  success: boolean;
  error?: string;
  id?: string;
  slug?: string;
};

export interface ContextRecipe {
  id?: string;
  basics: RecipeBasicsSchema;
  ingredients: RecipeIngredientSchema[];
  steps: RecipeStepSchema[];
  attributes: string[];
  status?: RecipeStatus;
}
