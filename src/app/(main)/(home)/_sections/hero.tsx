import ImageBackgroudCard from "@/components/cards/image-background-card";
import db from "@/db";
import { categories, images, licences, recipes, users } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import React from "react";

const HeroSection = async () => {
  const data = await db
    .select({
      ...getTableColumns(recipes),
      image: images.url,
      user: users.name,
      category: categories.name,
      categorySlug: categories.slug,
      licence: {
        ...getTableColumns(licences),
      },
    })
    .from(recipes)
    .innerJoin(images, eq(recipes.imageId, images.id))
    .innerJoin(users, eq(recipes.userId, users.id))
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
    .leftJoin(licences, eq(recipes.licenceId, licences.id))
    .limit(3);

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
      {data.map((recipe) => (
        <ImageBackgroudCard
          key={recipe.id}
          author={recipe.user}
          category={recipe.category}
          id={recipe.id}
          name={recipe.name}
          slug={recipe.slug}
          src={recipe.image}
          categorySlug={recipe.categorySlug}
          licence={recipe.licence}
        />
      ))}
    </div>
  );
};

export default HeroSection;
