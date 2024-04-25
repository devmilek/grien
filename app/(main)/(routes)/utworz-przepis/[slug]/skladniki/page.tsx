import React from "react";
import EditIngredientsForm from "./edit-ingredients-form";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { recipe as dbRecipe } from "@/lib/db/schema";
import IngredientCard from "./ingredient-card";

const EditIngredientsPage = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const recipe = await db.query.recipe.findFirst({
    where: eq(dbRecipe.slug, params.slug),
    with: {
      ingredients: true,
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
      <EditIngredientsForm recipeId={recipe.id} />
      <div className="mt-10 space-y-3">
        {recipe.ingredients.map((ingredient) => (
          <IngredientCard ingredient={ingredient} key={ingredient.id} />
        ))}
      </div>
    </div>
  );
};

export default EditIngredientsPage;
