import db from "@/db";
import { recipes, recipeSteps } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import React from "react";
import Stepper from "../_components/stepper";

const EditPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;

  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.slug, slug),
    with: {
      ingredients: true,
      steps: {
        orderBy: asc(recipeSteps.order),
      },
      cuisines: true,
      diets: true,
      occasions: true,
    },
  });

  if (!recipe) {
    return notFound();
  }

  return (
    <div className="container mx-auto">
      <Stepper
        data={{
          recipe,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          diets: recipe.diets,
          cuisines: recipe.cuisines,
          occasions: recipe.occasions,
        }}
      />
    </div>
  );
};

export default EditPage;
