import ImageBackgroudCard from "@/components/cards/image-background-card";
import db from "@/db";
import { categories, images, recipes, users } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import React from "react";

const HeroSection = async () => {
  const data = await db
    .select({
      ...getTableColumns(recipes),
      image: images.url,
      user: users.name,
      category: categories.name,
    })
    .from(recipes)
    .innerJoin(images, eq(recipes.imageId, images.id))
    .innerJoin(users, eq(recipes.userId, users.id))
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
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
        />
      ))}
    </div>
  );
};

export default HeroSection;
