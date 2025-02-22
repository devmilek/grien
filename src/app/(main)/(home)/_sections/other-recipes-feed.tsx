import React from "react";
import db from "@/db";
import { categories, images, recipes, users } from "@/db/schema";
import { asc, eq, getTableColumns } from "drizzle-orm";
import SmallRecipeCard from "@/components/cards/small-recipe-card";

const OtherRecipesFeed = async () => {
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
    .limit(4)
    .orderBy(asc(recipes.createdAt));
  return (
    <div className="p-6 rounded-xl bg-white">
      <h2 className="text-3xl font-display mb-6">Wasze przepisy</h2>
      <div className="grid grid-cols-4 gap-6">
        {data.map((recipe) => (
          <SmallRecipeCard
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
    </div>
  );
};

export default OtherRecipesFeed;
