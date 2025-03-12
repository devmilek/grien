import { z } from "zod";

export const recipeStepSchema = z.object({
  id: z.string().uuid(),
  imageId: z.string().uuid().optional().nullable(),
  description: z
    .string()
    .min(3, { message: "Krok musi zawierać co najmniej 3 znaki" }),
});

export type RecipeStepSchema = z.infer<typeof recipeStepSchema>;

export const recipeStepFormSchema = recipeStepSchema.omit({
  id: true,
});

export type RecipeStepFormSchema = z.infer<typeof recipeStepFormSchema>;
