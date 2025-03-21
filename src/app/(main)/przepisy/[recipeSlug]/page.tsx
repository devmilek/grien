import db from "@/db";
import { recipes } from "@/db/schema";
import { eq } from "drizzle-orm";
import React from "react";
import { constructMetadata } from "@/utils/construct-metadata";
import { Metadata } from "next";
import RecipeDetails from "@/features/recipe-details/components/recipe-details";
import { after } from "next/server";

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
  const slug = (await params).recipeSlug;

  after(async () => {
    const views = await db.query.recipes.findFirst({
      where: eq(recipes.slug, slug),
      columns: {
        views: true,
      },
    });

    if (views) {
      await db
        .update(recipes)
        .set({
          views: views.views + 1,
        })
        .where(eq(recipes.slug, slug));
    }
  });
  return <RecipeDetails slug={slug} />;
};

export default RecipePage;
