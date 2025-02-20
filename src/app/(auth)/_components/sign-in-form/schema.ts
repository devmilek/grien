import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z
    .string()
    .min(1, {
      message: "Password is required",
    })
    .max(128),
});

export type SignInSchema = z.infer<typeof signInSchema>;
