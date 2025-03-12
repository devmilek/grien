import db from "@/db";
import {
  recipeAttributes,
  recipeIngredients,
  recipes,
  recipeSteps,
} from "@/db/schema";
import RecipeEditor from "@/features/recipe-editor/components/recipe-editor";
import { getCurrentSession } from "@/lib/auth/utils";
import { constructMetadata } from "@/utils/construct-metadata";
import { and, asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = constructMetadata({
  title: "Edytuj przepis",
  description: "Edytuj przepis na swoim koncie",
  noIndex: true,
});

const EditRecipe = async ({
  params,
}: {
  params: Promise<{
    recipeSlug: string;
  }>;
}) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/logowanie");
  }

  const slug = (await params).recipeSlug;

  const recipe = await db.query.recipes.findFirst({
    where: and(eq(recipes.slug, slug), eq(recipes.userId, user.id)),
  });

  if (!recipe) {
    return redirect("/przepisy");
  }

  const ingredients = await db.query.recipeIngredients.findMany({
    where: eq(recipeIngredients.recipeId, recipe.id),
  });

  const steps = await db.query.recipeSteps.findMany({
    where: eq(recipeSteps.recipeId, recipe.id),
    orderBy: asc(recipeSteps.order),
  });

  const attributes = await db.query.recipeAttributes.findMany({
    where: eq(recipeAttributes.recipeId, recipe.id),
  });

  return (
    <div>
      <RecipeEditor
        recipe={{
          id: recipe.id,
          basics: {
            name: recipe.name,
            description: recipe.description,
            portions: recipe.portions,
            preparationTime: recipe.preparationTime,
            difficulty: recipe.difficulty,
            imageId: recipe.imageId,
            categoryId: recipe.categoryId,
          },
          steps: [
            ...steps.map((step) => ({
              description: step.content,
              id: step.id,
              imageId: step.imageId,
            })),
          ],
          attributes: [...attributes.map((attribute) => attribute.attributeId)],
          ingredients: [
            ...ingredients.map((ingredient) => ({
              ...ingredient,
              amount: Number(ingredient.amount),
            })),
          ],
        }}
      />
    </div>
  );
};

export default EditRecipe;
