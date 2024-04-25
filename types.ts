import { Category, Occasion, Cuisine, Diet, Recipe } from "@prisma/client";
import { category, recipeAttribute } from "./lib/db/schema";

export type ClerkErrors =
  | "form_password_pwned"
  | "form_identifier_exists"
  | "form_password_incorrect"
  | "form_identifier_not_found"
  | "form_param_nil"
  | "form_code_incorrect";

export interface AcceptFilesType {
  [key: string]: string[];
}

export type UtilityData = {
  categories: (typeof category.$inferSelect)[];
  attributes: (typeof recipeAttribute.$inferSelect)[];
};

export type RecipeWithCategoryAndUser = Recipe & {
  category: {
    name: string;
    slug: string;
  };
  user: {
    name: string;
    id: string;
  };
};
