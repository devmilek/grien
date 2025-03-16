import db from "@/db";
import { categories } from "@/db/schema";
import { constructMetadata } from "@/utils/construct-metadata";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import React from "react";
import RecipesFeed from "@/features/recipes-feed/components/recipes-feed";
import AttributeHero from "../../_components/attribute-hero";

interface CategoriesPageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: CategoriesPageProps) => {
  const slug = (await params).slug;

  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  if (!category) notFound();

  return constructMetadata({
    title: `Przepisy na ${category.name}`,
    description: category.description,
    image: `/${category.slug}.jpg`,
  });
};

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const slug = (await params).slug;

  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  if (!category) notFound();

  return (
    <div className="container space-y-8">
      <AttributeHero
        name={category.name}
        description={category.description}
        src={`/${category.slug}.jpg`}
      />
      <RecipesFeed categorySlug={category.slug} />
    </div>
  );
};

export default CategoriesPage;
