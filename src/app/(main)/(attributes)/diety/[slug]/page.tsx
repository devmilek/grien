import db from "@/db";
import { attributes } from "@/db/schema";
import RecipesFeed from "@/features/recipes-feed/components/recipes-feed";
import { constructMetadata } from "@/utils/construct-metadata";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import React from "react";
import AttributeHero from "../../_components/attribute-hero";

interface CategoriesPageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: CategoriesPageProps) => {
  const slug = (await params).slug;

  const attribute = await db.query.attributes.findFirst({
    where: and(eq(attributes.slug, slug), eq(attributes.type, "diets")),
  });

  if (!attribute) notFound();

  return constructMetadata({
    title: `Przepisy ${attribute.name}`,
    description: attribute.description,
    image: `/food.jpg`,
  });
};

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const slug = (await params).slug;

  const diet = await db.query.attributes.findFirst({
    where: and(eq(attributes.slug, slug), eq(attributes.type, "diets")),
  });

  if (!diet) notFound();

  return (
    <div className="container space-y-8">
      <AttributeHero name={diet.name} description={diet.description} />
      <RecipesFeed dietsSlugs={[diet.slug]} />
    </div>
  );
};

export default CategoriesPage;
