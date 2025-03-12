import db from "@/db";
import { recipeLikes, recipes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import React from "react";
import IngredientsList from "./_components/ingredients-list";
import StepsList from "./_components/steps-list";
import { TooltipProvider } from "@/components/ui/tooltip";
import CommentsCard from "./_components/comments-card";
import { getCurrentSession } from "@/lib/auth/utils";
import RecipeImage from "./_components/recipe-image";
import RecipeActions from "./_components/recipe-actions";
import RecipeAttributes from "./_components/recipe-attributes";
import RecipeHeader from "./_components/recipe-header";
import RecipeLicence from "./_components/recipe-licence";
import { constructMetadata } from "@/utils/construct-metadata";
import { Metadata } from "next";

interface RecipePageProps {
  params: Promise<{ recipeSlug: string }>;
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const slug = (await params).recipeSlug;
  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.slug, slug),
    with: {
      user: true,
      category: true,
      image: true,
    },
  });

  if (!recipe) {
    return {};
  }

  return constructMetadata({
    title: recipe.name,
    description: recipe.description,
    image: recipe.image?.url,
    url: `/${recipe.category.slug}/${recipe.slug}`,
    authors: {
      name: recipe.user.name,
      url: `/kucharze/${recipe.user.username}`,
    },
    category: recipe.category.name,
  });
}

const RecipePage = async ({ params }: RecipePageProps) => {
  const { user } = await getCurrentSession();
  const slug = (await params).recipeSlug;
  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.slug, slug),
    with: {
      image: {
        columns: {
          url: true,
        },
      },
      user: true,
      ingredients: true,
      category: true,
      steps: {
        with: {
          image: true,
        },
      },
      licence: true,
      attributes: {
        with: {
          attribute: true,
        },
      },
    },
  });

  if (!recipe) {
    notFound();
  }

  const likes = await db.$count(
    recipeLikes,
    eq(recipeLikes.recipeId, recipe.id)
  );

  return (
    <div className="mx-auto container">
      {/* hero */}
      <TooltipProvider>
        <section className="grid gap-4 lg:grid-cols-2 lg:gap-8 md:min-h-96 bg-white rounded-xl p-4 md:p-6">
          {recipe.image && (
            <RecipeImage imageUrl={recipe.image.url} licence={recipe.licence} />
          )}
          <div className="flex flex-col">
            <div className="flex-1">
              <RecipeHeader
                name={recipe.name}
                createdAt={recipe.createdAt}
                author={{
                  name: recipe.user.name,
                  username: recipe.user.username,
                }}
              />
              {/* ATTRIBUTES */}
              <RecipeAttributes
                attributes={recipe.attributes}
                category={recipe.category}
                difficulty={recipe.difficulty}
                portions={recipe.portions}
                preparationTime={recipe.preparationTime}
              />
              {/* DESC */}
              <p className="text-muted-foreground text-sm mt-4">
                {recipe.description}
              </p>
            </div>
            <RecipeActions
              recipe={recipe}
              steps={recipe.steps}
              likes={likes}
              userId={user?.id}
            />
          </div>
        </section>
      </TooltipProvider>
      {/* LAYOUT */}
      <div className="flex gap-6 mt-6 flex-col lg:flex-row">
        <div className="lg:w-[380px]">
          <IngredientsList
            ingredients={recipe.ingredients}
            portions={recipe.portions}
          />
        </div>
        <div className="flex-1 space-y-8">
          <StepsList steps={recipe.steps} />
          {recipe.licence && <RecipeLicence licence={recipe.licence} />}
          <CommentsCard recipeId={recipe.id} />
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
