import { Difficulty } from "@prisma/client";
import { z } from "zod";

export const BasicsInformationSchema = z.object({
  name: z
    .string({
      required_error: "Nazwa jest wymagana",
    })
    .min(1, {
      message: "Nazwa jest wymagana",
    }),
  image: z.string({
    required_error: "Zdjęcie jest wymagane",
  }),
  description: z
    .string({
      required_error: "Opis jest wymagany",
    })
    .min(1, {
      message: "Opis jest wymagany",
    }),
  categoryId: z.string({
    required_error: "Kategoria jest wymagana",
  }),
  servings: z.coerce
    .number({
      invalid_type_error: "Porcje są wymagane",
    })
    .min(1, {
      message: "Porcje są wymagane",
    }),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Poziom trudności jest wymagany",
  }),
  preparationTime: z.coerce
    .number({
      invalid_type_error: "Czas przygotowania jest wymagany",
    })
    .min(1, {
      message: "Czas przygotowania jest wymagany",
    }),
});

export const IngredientSchema = z.object({
  quantity: z.coerce.number().min(0).optional(),
  unit: z.string(),
  name: z.string().min(1),
});

export const PreparationStepSchema = z.object({
  image: z.string().optional(),
  description: z.string().min(1),
});
