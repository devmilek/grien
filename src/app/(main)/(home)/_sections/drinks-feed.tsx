import React from "react";
import db from "@/db";
import { categories, images, recipes, users } from "@/db/schema";
import { asc, eq, getTableColumns } from "drizzle-orm";
import SmallHorizontCard from "@/components/cards/small-horizont-card";

const DrinksFeed = async () => {
  const data = await db
    .select({
      ...getTableColumns(recipes),
      image: images.url,
      user: users.name,
      category: categories.name,
      categorySlug: categories.slug,
    })
    .from(recipes)
    .innerJoin(images, eq(recipes.imageId, images.id))
    .innerJoin(users, eq(recipes.userId, users.id))
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
    .limit(5)
    .orderBy(asc(recipes.createdAt));
  return (
    <div className="p-6 bg-white rounded-xl">
      <h3 className="text-2xl font-display">Napoje</h3>
      <div className="space-y-4 mt-4">
        {data.map((recipe) => (
          <SmallHorizontCard
            key={recipe.id}
            author={recipe.user}
            id={recipe.id}
            name={recipe.name}
            slug={recipe.slug}
            src={recipe.image}
            createdAt={recipe.createdAt}
            categorySlug={recipe.categorySlug}
          />
        ))}
      </div>
    </div>
  );
};

export default DrinksFeed;
