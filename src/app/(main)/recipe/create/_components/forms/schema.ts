import { difficulties } from "@/db/schema";
import { z } from "zod";

export const recipeBasicsSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nazwa musi zawierać co najmniej 3 znaki" })
    .max(255, { message: "Nazwa nie może przekraczać 255 znaków" }),
  imageSrc: z.string().url().optional(),
  description: z
    .string()
    .min(3, { message: "Opis musi zawierać co najmniej 3 znaki" })
    .max(500, { message: "Opis nie może przekraczać 500 znaków" }),
  difficulty: z
    .enum(difficulties, {
      errorMap: () => ({ message: "Wybierz poziom trudności" }),
    })
    .default("easy"),
  preparationTime: z.coerce
    .number()
    .min(1, { message: "Czas przygotowania musi być większy niż 0" }),
  portions: z.coerce
    .number()
    .min(1, { message: "Liczba porcji musi być większa niż 0" }),
  categoryId: z.string().uuid({ message: "Wybierz kategorię" }),
});

export type RecipeBasicsSchema = z.infer<typeof recipeBasicsSchema>;

export const recipeIngredientSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nazwa musi zawierać co najmniej 3 znaki" }),
  amount: z.number(),
  unit: z.string(),
});

export type RecipeIngredientSchema = z.infer<typeof recipeIngredientSchema>;

export const recipeStepSchema = z.object({
  description: z
    .string()
    .min(3, { message: "Krok musi zawierać co najmniej 3 znaki" }),
});

export type RecipeStepSchema = z.infer<typeof recipeStepSchema>;
