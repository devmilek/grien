import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().min(1),
});

export type CommentSchema = z.infer<typeof commentSchema>;
