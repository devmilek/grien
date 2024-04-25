"use server";

import { db } from "@/lib/db";
import { preparationStep } from "@/lib/db/schema";
import { PreparationStepSchema } from "@/schemas/recipe";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const addStep = async (
  data: z.infer<typeof PreparationStepSchema>,
  recipeId: number,
  position: number,
) => {
  const validatedFields = PreparationStepSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  const { description, image } = validatedFields.data;

  await db.insert(preparationStep).values({
    description,
    imageUrl: image,
    position,
    recipeId,
  });

  revalidatePath("/a-new-recipe/[slug]/kroki-przygotowania", "page");
};

export const deleteStep = async (stepId: number) => {
  await db.delete(preparationStep).where(eq(preparationStep.id, stepId));

  revalidatePath("/a-new-recipe/[slug]/kroki-przygotowania", "page");
};

export const reorderSteps = async (
  list: { id: number; position: number }[],
) => {
  for (let item of list) {
    // await db.preparationStep.update({
    //   where: { id: item.id },
    //   data: { position: item.position },
    // });
    await db
      .update(preparationStep)
      .set({ position: item.position })
      .where(eq(preparationStep.id, item.id));
  }
  revalidatePath("/a-new-recipe/[slug]/kroki-przygotowania", "page");
};
