import { z } from "zod";

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
  unit: z.string().optional().nullable(),
});

export type RecipeIngredientSchema = z.infer<typeof recipeIngredientSchema>;

export const recipeIngredientFormSchema = recipeIngredientSchema.omit({
  id: true,
});

export type RecipeIngredientFormSchema = z.infer<
  typeof recipeIngredientFormSchema
>;
