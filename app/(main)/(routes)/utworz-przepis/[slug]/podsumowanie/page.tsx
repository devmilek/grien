import React from "react";
import AttributesForm from "./attributes-form";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { recipe as dbRecipe } from "@/lib/db/schema";

const SummaryPage = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const recipe = await db.query.recipe.findFirst({
    where: eq(dbRecipe.slug, params.slug),
    columns: {
      id: true,
    },
    with: {
      attributesToRecipes: true,
    },
  });

  if (!recipe) {
    return null;
  }

  return (
    <div className="bg-white p-12 rounded-xl">
      <h1 className="font-display text-3xl">Dodatkowe informacje</h1>
      <AttributesForm
        recipeId={recipe.id}
        selectedAttributes={recipe.attributesToRecipes}
      />
    </div>
  );
};

export default SummaryPage;
