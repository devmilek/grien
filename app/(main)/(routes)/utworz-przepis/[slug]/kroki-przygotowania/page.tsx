import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import React from "react";
import { recipe as dbRecipe, preparationStep } from "@/lib/db/schema";
import StepsForm from "./steps-form";
import StepsFeed from "./steps-feed";

const StepsPage = async ({ params }: { params: { slug: string } }) => {
  const recipe = await db.query.recipe.findFirst({
    where: eq(dbRecipe.slug, params.slug),
    with: {
      preparationSteps: {
        orderBy: (preparationStep, { asc }) => asc(preparationStep.position),
      },
    },
    columns: {
      id: true,
    },
  });

  if (!recipe) {
    return <div>Przepis nie istnieje</div>;
  }

  return (
    <div>
      <div className="mt-10 space-y-3 mb-12">
        <StepsForm
          recipeId={recipe.id}
          latestPosition={recipe.preparationSteps.length + 1}
        />
      </div>
      <StepsFeed steps={recipe.preparationSteps} />
    </div>
  );
};

export default StepsPage;
