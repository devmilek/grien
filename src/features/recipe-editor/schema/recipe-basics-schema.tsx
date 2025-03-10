import { difficulties } from "@/db/schema";
import { z } from "zod";

export const recipeBasicsSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nazwa musi zawierać co najmniej 3 znaki" })
    .max(255, { message: "Nazwa nie może przekraczać 255 znaków" }),
  imageId: z.string().uuid({
    message: "Musisz wybrać zdjęcie przepisu",
  }),
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
