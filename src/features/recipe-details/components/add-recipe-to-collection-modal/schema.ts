import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(3).max(50),
  public: z.boolean(),
});

export type CreateCollectionSchema = z.infer<typeof createCollectionSchema>;
