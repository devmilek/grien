import React from "react";
import db from "@/db";
import { categories, images, recipes, users } from "@/db/schema";
import { asc, eq, getTableColumns } from "drizzle-orm";
import HorizontalCard from "@/components/cards/horizontal-card";

const MainDishesFeed = async () => {
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
      <h2 className="text-3xl mb-6 font-display">Dania głowne</h2>
      <div className="grid gap-4">
        {data.map((recipe) => (
          <HorizontalCard
            key={recipe.id}
            author={recipe.user}
            category={recipe.category}
            id={recipe.id}
            name={recipe.name}
            description={recipe.description}
            slug={recipe.slug}
            src={recipe.image}
          />
        ))}
      </div>
    </div>
  );
};

export default MainDishesFeed;
