import { difficulties } from "@/db/schema";
import { z } from "zod";

export const createRecipeSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(500),
  difficulty: z.enum(difficulties),
  preparationTime: z.number().min(1),
  portions: z.number().min(1),
  categoryId: z.string().uuid(),
});

export type CreateRecipeSchema = z.infer<typeof createRecipeSchema>;
