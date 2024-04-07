import { db } from "@/lib/db";
import React, { Suspense } from "react";
import IngredientsFeed from "./_components/ingredients-feed";
import StepsFeed from "./_components/steps-feed";
import AuthorCard from "./_components/author-card";
import RecipeHero from "./_components/recipe-hero";

export const generateMetadata = async ({
  params,
}: {
  params: { recipeId: string };
}) => {
  const recipe = await db.recipe.findUnique({
    where: {
      id: params.recipeId,
    },
    include: {
      user: true,
    },
  });

  if (!recipe) {
    return null;
  }

  return {
    title: recipe.name,
    description: recipe.description,
    image: recipe.image,
    type: "article",
    article: {
      publishedTime: recipe.createdAt,
      modifiedTime: recipe.updatedAt,
      authors: [recipe.user?.name],
    },
  };
};

const page = async ({ params }: { params: { recipeId: string } }) => {
  const recipe = await db.recipe.findUnique({
    where: {
      id: params.recipeId,
      published: true,
    },
    include: {
      user: true,
      category: true,
      ingredients: true,
    },
  });

  if (!recipe || !recipe.image) {
    return null;
  }

  return (
    <section className="">
      <RecipeHero recipe={recipe} />
      <div className="flex flex-col-reverse lg:flex-row gap-8 mt-10">
        <div className="space-y-10 flex-1">
          <Suspense>
            <StepsFeed recipeId={params.recipeId} />
          </Suspense>
          <AuthorCard user={recipe.user} />
        </div>
        <div className="lg:w-[400px]">
          <Suspense>
            <IngredientsFeed recipeId={params.recipeId} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default page;
