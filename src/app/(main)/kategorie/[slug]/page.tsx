import db from "@/db";
import { categories } from "@/db/schema";
import { constructMetadata } from "@/utils/construct-metadata";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import RecipesFeed from "@/features/recipes-feed/components/recipes-feed";

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
      <div className="h-96 w-full relative overflow-hidden rounded-xl">
        <div className="z-40 bg-black/60 size-full absolute flex items-center justify-center flex-col text-white">
          <h1 className="font-display text-5xl mt-1">{category.name}</h1>
          <p className="text-sm mt-4">{category.description}</p>
        </div>
        <Image src={`/${category.slug}.jpg`} alt="" fill objectFit="cover" />
      </div>
      <RecipesFeed categorySlug={category.slug} />
    </div>
  );
};

export default CategoriesPage;
