"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { RecipeStatus } from "@/db/schema";
import { z } from "zod";
import {
  recipeBasicsSchema,
  RecipeBasicsSchema,
} from "../schema/recipe-basics-schema";
import {
  recipeIngredientSchema,
  RecipeIngredientSchema,
} from "../schema/recipe-ingredient-shema";
import {
  recipeStepSchema,
  RecipeStepSchema,
} from "../schema/recipe-step-schema";
import { createRecipe } from "../actions/create-recipe";
import { updateRecipe as updateRecipeAction } from "../actions/update-recipe";
import { ContextRecipe } from "../types";

// Domyślne wartości dla nowego przepisu
const defaultRecipe: ContextRecipe = {
  basics: {
    imageId: "",
    name: "",
    description: "",
    difficulty: "" as never,
    preparationTime: undefined as never,
    portions: undefined as never,
    categoryId: "",
  },
  ingredients: [],
  steps: [],
  attributes: [],
  status: "draft",
};

export type RecipeCreationStep =
  | "basics"
  | "ingredients"
  | "steps"
  | "additional";

// Interfejs kontekstu
interface RecipeContextType {
  recipe: ContextRecipe;
  currentStep: RecipeCreationStep;
  setCurrentStep: (step: RecipeCreationStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  setRecipeBasics: (basics: Partial<RecipeBasicsSchema>) => void;
  addIngredient: (ingredient: RecipeIngredientSchema) => void;
  updateIngredient: (
    id: string,
    ingredient: Partial<RecipeIngredientSchema>
  ) => void;
  removeIngredient: (id: string) => void;
  addStep: (step: RecipeStepSchema) => void;
  updateStep: (id: string, step: Partial<RecipeStepSchema>) => void;
  removeStep: (id: string) => void;
  setFullRecipe: (recipe: ContextRecipe) => void;
  resetRecipe: () => void;
  toggleAttribute: (attribute: string) => void;
  isNew: boolean; // Czy to nowy przepis czy edycja
  isPublishing: boolean;
  isSaving: boolean;
  publishRecipe: () => Promise<{
    success: boolean;
    error?: string;
    id?: string;
  }>;
  saveAsDraft: () => Promise<{ success: boolean; error?: string; id?: string }>;
  updateRecipe: () => Promise<{ success: boolean; error?: string }>;
}

// Tworzenie kontekstu z wartościami domyślnymi
const RecipeContext = createContext<RecipeContextType | null>(null);

// Props dla providera
interface RecipeProviderProps {
  children: ReactNode;
  initialRecipe?: ContextRecipe;
  initialStep?: RecipeCreationStep;
}

const STEP_ORDER: RecipeCreationStep[] = [
  "basics",
  "ingredients",
  "steps",
  "additional",
];

// Provider kontekstu
export const RecipeProvider: React.FC<RecipeProviderProps> = ({
  children,
  initialRecipe,
  initialStep = "additional",
}) => {
  const [recipe, setRecipe] = useState<ContextRecipe>(
    initialRecipe || defaultRecipe
  );
  const [currentStep, setCurrentStep] =
    useState<RecipeCreationStep>(initialStep);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isNew = useMemo(() => !recipe.id, [recipe.id]);

  const nextStep = useCallback(() => {
    console.log("nextStep");
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  }, [currentStep]);

  // Aktualizacja podstawowych informacji o przepisie
  const setRecipeBasics = useCallback((basics: Partial<RecipeBasicsSchema>) => {
    setRecipe((prev) => ({
      ...prev,
      basics: { ...prev.basics, ...basics },
    }));
  }, []);

  // Dodawanie nowego składnika
  const addIngredient = useCallback((ingredient: RecipeIngredientSchema) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient],
    }));
  }, []);

  // Aktualizacja istniejącego składnika
  const updateIngredient = useCallback(
    (id: string, ingredient: Partial<RecipeIngredientSchema>) => {
      setRecipe((prev) => {
        const index = prev.ingredients.findIndex((item) => item.id === id);
        if (index === -1) return prev; // nie znaleziono składnika o podanym ID

        const updatedIngredients = [...prev.ingredients];
        updatedIngredients[index] = {
          ...updatedIngredients[index],
          ...ingredient,
        };
        return { ...prev, ingredients: updatedIngredients };
      });
    },
    []
  );

  // Usuwanie składnika
  const removeIngredient = useCallback((id: string) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((item) => item.id !== id),
    }));
  }, []);

  // Dodawanie nowego kroku
  const addStep = useCallback((step: RecipeStepSchema) => {
    setRecipe((prev) => ({
      ...prev,
      steps: [...prev.steps, step],
    }));
  }, []);

  // Aktualizacja istniejącego kroku
  const updateStep = useCallback(
    (id: string, step: Partial<RecipeStepSchema>) => {
      setRecipe((prev) => {
        const index = prev.steps.findIndex((item) => item.id === id);
        if (index === -1) return prev; // nie znaleziono kroku o podanym ID

        const updatedSteps = [...prev.steps];
        updatedSteps[index] = { ...updatedSteps[index], ...step };
        return { ...prev, steps: updatedSteps };
      });
    },
    []
  );

  // Usuwanie kroku
  const removeStep = useCallback((id: string) => {
    setRecipe((prev) => ({
      ...prev,
      steps: prev.steps.filter((step) => step.id !== id),
    }));
  }, []);

  // Ustawienie całego przepisu (np. z danych serwerowych)
  const setFullRecipe = useCallback((newRecipe: ContextRecipe) => {
    setRecipe(newRecipe);
  }, []);

  // Reset przepisu do wartości domyślnych
  const resetRecipe = useCallback(() => {
    setRecipe(defaultRecipe);
  }, []);

  const toggleAttribute = useCallback((attribute: string) => {
    setRecipe((prev) => {
      const attributes = prev.attributes.includes(attribute)
        ? prev.attributes.filter((item) => item !== attribute)
        : [...prev.attributes, attribute];
      return { ...prev, attributes };
    });
  }, []);

  const validateRecipe = useCallback(() => {
    try {
      // Walidacja podstawowych informacji
      recipeBasicsSchema.parse(recipe.basics);

      // Walidacja składników
      if (recipe.ingredients.length === 0) {
        setCurrentStep("ingredients");
        return {
          valid: false,
          error: "Przepis musi zawierać co najmniej jeden składnik",
        };
      }

      try {
        for (const ingredient of recipe.ingredients) {
          recipeIngredientSchema.parse(ingredient);
        }
      } catch (error) {
        setCurrentStep("ingredients");
        if (error instanceof z.ZodError) {
          return {
            valid: false,
            error: error.errors[0].message || "Niepoprawne dane składnika",
          };
        }
      }

      // Walidacja kroków
      if (recipe.steps.length === 0) {
        setCurrentStep("steps");
        return {
          valid: false,
          error: "Przepis musi zawierać co najmniej jeden krok",
        };
      }

      try {
        for (const step of recipe.steps) {
          recipeStepSchema.parse(step);
        }
      } catch (error) {
        setCurrentStep("steps");
        if (error instanceof z.ZodError) {
          return {
            valid: false,
            error: error.errors[0].message || "Niepoprawne dane kroku",
          };
        }
      }

      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          error: error.errors[0].message || "Niepoprawne dane przepisu",
        };
      }
      return {
        valid: false,
        error: "Wystąpił błąd podczas walidacji przepisu",
      };
    }
  }, [recipe]);

  // Publikowanie przepisu (nowy lub aktualizacja)
  const publishRecipe = useCallback(async () => {
    try {
      setIsPublishing(true);

      // Walidacja przepisu
      const validation = validateRecipe();
      if (!validation.valid) {
        setCurrentStep("basics");
        return { success: false, error: validation.error };
      }

      // Przygotuj obiekt przepisu z statusem "published"
      const recipeToSave = { ...recipe, status: "published" as RecipeStatus };

      // Użyj Server Action do zapisania przepisu
      const result = isNew
        ? await createRecipe(recipeToSave)
        : await updateRecipeAction(recipeToSave);

      if (result.success && result.id) {
        // Aktualizuj lokalne ID i status jeśli to był nowy przepis
        if (isNew) {
          setRecipe((prev) => ({
            ...prev,
            id: result.id,
            status: "published",
          }));
        } else {
          setRecipe((prev) => ({ ...prev, status: "published" }));
        }
      }

      return result;
    } catch (error) {
      console.error("Błąd podczas publikowania przepisu:", error);
      return {
        success: false,
        error: "Wystąpił błąd podczas publikowania przepisu",
      };
    } finally {
      setIsPublishing(false);
    }
  }, [recipe, isNew, validateRecipe]);

  // Zapisywanie przepisu jako wersji roboczej
  const saveAsDraft = useCallback(async () => {
    try {
      setIsSaving(true);

      // Dla wersji roboczej wymagamy tylko podstawowych danych
      try {
        recipeBasicsSchema.parse(recipe.basics);
        setCurrentStep("basics");
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            success: false,
            error:
              error.errors[0].message || "Niepoprawne dane podstawowe przepisu",
          };
        }
      }

      // Przygotuj obiekt przepisu z statusem "draft"
      const recipeToSave = { ...recipe, status: "draft" as RecipeStatus };

      // Użyj Server Action do zapisania przepisu
      const result = isNew
        ? await createRecipe(recipeToSave)
        : await updateRecipeAction(recipeToSave);

      if (result.success && result.id && isNew) {
        setRecipe((prev) => ({ ...prev, id: result.id, status: "draft" }));
      }

      return result;
    } catch (error) {
      console.error("Błąd podczas zapisywania wersji roboczej:", error);
      return {
        success: false,
        error: "Wystąpił błąd podczas zapisywania wersji roboczej",
      };
    } finally {
      setIsSaving(false);
    }
  }, [recipe, isNew]);

  // Aktualizacja istniejącego przepisu (zachowując jego status)
  const updateRecipe = useCallback(async () => {
    if (isNew) {
      return {
        success: false,
        error: "Nie można zaktualizować przepisu, który jeszcze nie istnieje",
      };
    }

    try {
      setIsSaving(true);

      // Walidacja zależy od statusu przepisu
      if (recipe.status === "published") {
        const validation = validateRecipe();
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }
      } else {
        // Dla draftu wymagamy tylko podstawowych danych
        try {
          recipeBasicsSchema.parse(recipe.basics);
        } catch (error) {
          setCurrentStep("basics");
          if (error instanceof z.ZodError) {
            return {
              success: false,
              error:
                error.errors[0].message ||
                "Niepoprawne dane podstawowe przepisu",
            };
          }
        }
      }

      // Użyj Server Action do aktualizacji przepisu
      return await updateRecipeAction(recipe);
    } catch (error) {
      console.error("Błąd podczas aktualizacji przepisu:", error);
      return {
        success: false,
        error: "Wystąpił błąd podczas aktualizacji przepisu",
      };
    } finally {
      setIsSaving(false);
    }
  }, [recipe, isNew, validateRecipe]);

  return (
    <RecipeContext.Provider
      value={{
        recipe,
        setRecipeBasics,
        addIngredient,
        updateIngredient,
        removeIngredient,
        addStep,
        updateStep,
        removeStep,
        setFullRecipe,
        resetRecipe,
        currentStep,
        setCurrentStep,
        nextStep,
        previousStep,
        toggleAttribute,
        isNew,
        isPublishing,
        isSaving,
        publishRecipe,
        saveAsDraft,
        updateRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

// Hook do łatwego używania kontekstu
export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within a RecipeProvider");
  }
  return context;
};

// Wysokopoziomowy komponent do przekazywania danych z Server Component do Client Component
export function RecipeInitializer({
  children,
  initialRecipe,
}: {
  children: ReactNode;
  initialRecipe?: ContextRecipe;
}) {
  return (
    <RecipeProvider initialRecipe={initialRecipe}>{children}</RecipeProvider>
  );
}
