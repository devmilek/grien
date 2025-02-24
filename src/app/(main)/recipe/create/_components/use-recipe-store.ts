import { create } from "zustand";
import {
  RecipeBasicsSchema,
  RecipeIngredientSchema,
  RecipeStepSchema,
} from "./forms/schema";

export const steps = [
  "basics",
  "ingredients",
  "steps",
  "additional",
  "summary",
] as const;
export type Step = (typeof steps)[number];

export type IngredientWithId = RecipeIngredientSchema & {
  id: string;
};

export type PreparationStepWithId = RecipeStepSchema & {
  id: string;
};

export type RecipeAttributeType = "diet" | "cuisine" | "occasion";

export type RecipeAttribute = {
  id: string;
  type: RecipeAttributeType;
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

  preparationSteps: PreparationStepWithId[];
  setPreparationSteps: (steps: PreparationStepWithId[]) => void;
  addPreparationStep: (step: PreparationStepWithId) => void;
  updatePreparationStep: (step: PreparationStepWithId) => void;
  removePreparationStep: (id: string) => void;
  getPreparationStepById: (id: string) => PreparationStepWithId | undefined;

  attributes: RecipeAttribute[];
  setAttributes: (attributes: RecipeAttribute[]) => void;
  addAttribute: (attribute: RecipeAttribute) => void;
  removeAttribute: (id: string) => void;

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

  preparationSteps: [],

  setPreparationSteps: (steps) => set({ preparationSteps: steps }),

  addPreparationStep: (step) =>
    set((state) => ({
      preparationSteps: [...state.preparationSteps, step],
    })),

  updatePreparationStep: (updatedStep) =>
    set((state) => ({
      preparationSteps: state.preparationSteps.map((step) =>
        step.id === updatedStep.id ? updatedStep : step
      ),
    })),

  removePreparationStep: (id) =>
    set((state) => ({
      preparationSteps: state.preparationSteps.filter((step) => step.id !== id),
    })),

  getPreparationStepById: (id) => {
    const state = get();
    return state.preparationSteps.find((step) => step.id === id);
  },

  attributes: [],
  setAttributes: (attributes) => set({ attributes }),
  addAttribute: (attribute) =>
    set((state) => ({
      attributes: [...state.attributes, attribute],
    })),
  removeAttribute: (id) =>
    set((state) => ({
      attributes: state.attributes.filter((attribute) => attribute.id !== id),
    })),

  currentStep: "ingredients",
  setCurrentStep: (currentStep) => set({ currentStep }),
}));
