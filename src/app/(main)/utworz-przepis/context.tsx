"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { difficulties } from "@/db/schema";
import { z } from "zod";

// Schematy walidacji
export const recipeBasicsSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nazwa musi zawierać co najmniej 3 znaki" })
    .max(255, { message: "Nazwa nie może przekraczać 255 znaków" }),
  imageId: z.string().uuid().optional(),
  description: z
    .string()
    .min(3, { message: "Opis musi zawierać co najmniej 3 znaki" })
    .max(500, { message: "Opis nie może przekraczać 500 znaków" }),
  difficulty: z.enum(difficulties, {
    errorMap: () => ({ message: "Musisz wybrać poziom trudności" }),
  }),
  preparationTime: z.coerce.number().positive({
    message: "Czas przygotowania musi być większy niż 0",
  }),
  portions: z.coerce.number().min(1, {
    message: "Ilość porcji musi być większa niż 0",
  }),
  categoryId: z.string().uuid({ message: "Kategoria jest wymagana" }),
});

export type RecipeBasicsSchema = z.infer<typeof recipeBasicsSchema>;

export const recipeIngredientSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(3, { message: "Nazwa musi zawierać co najmniej 3 znaki" }),
  amount: z.coerce
    .number({
      message: "Ilość musi być liczbą",
      invalid_type_error: "Ilość musi być liczbą",
    })
    .positive({
      message: "Ilość musi być większa niż 0",
    }),
  unit: z.string().optional(),
});

export type RecipeIngredientSchema = z.infer<typeof recipeIngredientSchema>;

export const recipeIngredientFormSchema = recipeIngredientSchema.omit({
  id: true,
});

export type RecipeIngredientFormSchema = z.infer<
  typeof recipeIngredientFormSchema
>;

export const recipeStepSchema = z.object({
  id: z.string().uuid(),
  imageId: z.string().uuid().optional(),
  description: z
    .string()
    .min(3, { message: "Krok musi zawierać co najmniej 3 znaki" }),
});

export type RecipeStepSchema = z.infer<typeof recipeStepSchema>;

export const recipeStepFormSchema = recipeStepSchema.omit({
  id: true,
});

export type RecipeStepFormSchema = z.infer<typeof recipeStepFormSchema>;

// Definicja całego przepisu
export interface Recipe {
  basics: RecipeBasicsSchema;
  ingredients: RecipeIngredientSchema[];
  steps: RecipeStepSchema[];
  attributes: string[];
}

// Domyślne wartości dla nowego przepisu
const defaultRecipe: Recipe = {
  basics: {
    name: "Naleśniki z kurczakiem w sosie bolognese",
    description: "Pyszne nalesniki",
    difficulty: "easy",
    preparationTime: 90,
    portions: 4,
    categoryId: "83b7fdd7-e846-49f3-9cc9-7879ff028338",
  },
  ingredients: [
    {
      id: "f5d8bc39-350f-4246-a9e7-e071c8f767f3",
      name: "Mąka",
      amount: 1,
      unit: "szklanka",
    },
  ],
  steps: [
    {
      id: "f5d8bc39-350f-4246-a9e7-e071c8f767f3",
      description:
        "Filet z piersi kurczaka obierz z błonek i podziel na niewielkie, ale równej wielkości sześciany. Marchewkę umyj, obierz i pokrój w kostkę. Włącz piekarnik i ustaw temperaturę na 200°C. Zanim się nagrzeje, zetrzyj ser żółty na grubej tarce.",
    },
  ],
  attributes: [],
};

export type RecipeCreationStep =
  | "basics"
  | "ingredients"
  | "steps"
  | "additional";

// Interfejs kontekstu
interface RecipeContextType {
  recipe: Recipe;
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
  setFullRecipe: (recipe: Recipe) => void;
  resetRecipe: () => void;
  toggleAttribute: (attribute: string) => void;
}

// Tworzenie kontekstu z wartościami domyślnymi
const RecipeContext = createContext<RecipeContextType | null>(null);

// Props dla providera
interface RecipeProviderProps {
  children: ReactNode;
  initialRecipe?: Recipe;
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
  initialStep = "basics",
}) => {
  const [recipe, setRecipe] = useState<Recipe>(initialRecipe || defaultRecipe);
  const [currentStep, setCurrentStep] =
    useState<RecipeCreationStep>(initialStep);

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
  const setFullRecipe = useCallback((newRecipe: Recipe) => {
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
  initialRecipe?: Recipe;
}) {
  return (
    <RecipeProvider initialRecipe={initialRecipe}>{children}</RecipeProvider>
  );
}
