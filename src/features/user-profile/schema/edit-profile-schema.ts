import { z } from "zod";

export const editProfileSchema = z.object({
  imageUrl: z.string().nullable(),
  name: z.string().min(3, "Imię jest za krótkie").max(30, {
    message: "Imię jest za długie",
  }),
  username: z.string().min(3, "Nazwa użytkownika jest za krótka").max(30, {
    message: "Nazwa użytkownika jest za długa",
  }),
  bio: z.string().max(500, "Bio jest za długie"),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;
