import { create } from "zustand";
import { RecipeBasicsSchema, RecipeIngredientSchema } from "./forms/schema";

export const steps = ["basics", "ingredients", "steps", "additional"] as const;
export type Step = (typeof steps)[number];

export type IngredientWithId = RecipeIngredientSchema & {
  id: string;
};

type Store = {
  basics: RecipeBasicsSchema;
  setBasics: (basics: RecipeBasicsSchema) => void;

  ingredients: IngredientWithId[];
  setIngredients: (ingredients: IngredientWithId[]) => void;
  addIngredient: (ingredient: IngredientWithId) => void;
  updateIngredient: (ingredient: IngredientWithId) => void;
  removeIngredient: (id: string) => void;
  getIngredientById: (id: string) => IngredientWithId | undefined;

  currentStep: Step;
  setCurrentStep: (step: Step) => void;
};

export const useRecipeStore = create<Store>()((set, get) => ({
  basics: {
    name: "",
    description: "",
    difficulty: "easy",
    preparationTime: 0,
    portions: 0,
    categoryId: "",
  },
  setBasics: (basics) => set({ basics }),

  ingredients: [],
  setIngredients: (ingredients) => set({ ingredients }),
  addIngredient: (ingredient) =>
    set((state) => ({
      ingredients: [...state.ingredients, ingredient],
    })),
  updateIngredient: (updatedIngredient) =>
    set((state) => {
      const exists = state.ingredients.some(
        (ing) => ing.id === updatedIngredient.id
      );
      if (!exists) return state;

      return {
        ingredients: state.ingredients.map((ingredient) =>
          ingredient.id === updatedIngredient.id
            ? updatedIngredient
            : ingredient
        ),
      };
    }),
  removeIngredient: (id) =>
    set((state) => ({
      ingredients: state.ingredients.filter(
        (ingredient) => ingredient.id !== id
      ),
    })),

  getIngredientById: (id) => {
    const state = get();
    return state.ingredients.find((ingredient) => ingredient.id === id);
  },

  currentStep: "ingredients",
  setCurrentStep: (currentStep) => set({ currentStep }),
}));
