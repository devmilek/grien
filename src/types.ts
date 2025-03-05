import { Licence, Recipe } from "./db/schema";

// export interface Ingredient {
//   name: string;
//   quantity: number | null;
//   unit: string | null;
// }

// interface Recipe {
//   name: string;
//   name_eng: string;
//   description: string;
//   difficulty: "easy" | "medium" | "hard";
//   preparationTime: number;
//   portions: number;
//   ingredients: {
//     name: string;
//     quantity: number | null;
//     unit: string | null;
//   }[];
//   steps: string[];
// }

export type RecipeForCard = Recipe & {
  category: {
    name: string;
    slug: string;
  };
  imageSrc: string;
  licence: Licence | null;
  user: {
    name: string;
    username: string | null;
    image: string | null;
  };
};
