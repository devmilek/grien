import { db } from "@/lib/db";
import React, { Suspense } from "react";
import IngredientsFeed from "./_components/ingredients-feed";
import StepsFeed from "./_components/steps-feed";
import AuthorCard from "./_components/author-card";
import RecipeHero from "./_components/recipe-hero";
import { getRecipe } from "@/data";

const page = async ({ params }: { params: { slug: string } }) => {
  const recipe = await getRecipe(params.slug);

  if (!recipe || !recipe.imageUrl) {
    return null;
  }

  return (
    <section className="">
      <RecipeHero recipe={recipe} />
      <div className="flex flex-col-reverse lg:flex-row gap-8 mt-10">
        <div className="space-y-10 flex-1">
          <Suspense>
            <StepsFeed recipeId={recipe.id} />
          </Suspense>
          <AuthorCard user={recipe.user} />
        </div>
        <div className="lg:w-[400px]">
          <Suspense>
            <IngredientsFeed recipeId={recipe.id} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default page;
