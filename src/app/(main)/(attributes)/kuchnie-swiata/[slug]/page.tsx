import db from "@/db";
import { attributes } from "@/db/schema";
import RecipesFeed from "@/features/recipes-feed/components/recipes-feed";
import { constructMetadata } from "@/utils/construct-metadata";
import { and, eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

interface CategoriesPageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: CategoriesPageProps) => {
  const slug = (await params).slug;

  const attribute = await db.query.attributes.findFirst({
    where: and(eq(attributes.slug, slug), eq(attributes.type, "cuisines")),
  });

  if (!attribute) notFound();

  return constructMetadata({
    title: `Przepisy kuchni - ${attribute.name}`,
    description: attribute.description,
    image: `/food.jpg`,
  });
};

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const slug = (await params).slug;

  const cuisine = await db.query.attributes.findFirst({
    where: and(eq(attributes.slug, slug), eq(attributes.type, "cuisines")),
  });

  if (!cuisine) notFound();

  return (
    <div className="container space-y-8">
      <div className="h-96 w-full relative overflow-hidden rounded-xl">
        <div className="z-40 bg-black/60 size-full absolute flex items-center justify-center flex-col text-white">
          <h1 className="font-display text-5xl mt-1">{cuisine.name}</h1>
          <p className="text-sm mt-4">{cuisine.description}</p>
        </div>
        <Image src={`/food.jpg`} alt="" fill objectFit="cover" />
      </div>
      <RecipesFeed dietsSlugs={[cuisine.slug]} />
    </div>
  );
};

export default CategoriesPage;
