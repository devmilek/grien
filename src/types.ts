interface Ingredient {
  name: string;
  quantity: number | null;
  unit: string | null;
}

interface Recipe {
  name: string;
  name_eng: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  preparationTime: number;
  portions: number;
  ingredients: {
    name: string;
    quantity: number | null;
    unit: string | null;
  }[];
  steps: string[];
}
