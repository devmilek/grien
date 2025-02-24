import db from "@/db";
import React from "react";
import { categories, images, licences, recipes, users } from "@/db/schema";
import { desc, eq, getTableColumns } from "drizzle-orm";
import ImageBackgroudCard from "@/components/cards/image-background-card";

const PopularFeed = async () => {
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
    .limit(3)
    .orderBy(desc(recipes.createdAt));
  return (
    <div className="p-6 rounded-xl bg-white">
      <h2 className="font-display text-3xl mb-5">Najpopularniejsze</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {data.map((recipe, index) => (
          <ImageBackgroudCard
            key={recipe.id}
            author={recipe.user}
            category={recipe.category}
            id={recipe.id}
            name={recipe.name}
            slug={recipe.slug}
            src={recipe.image}
            className={index === 2 ? "md:col-span-2" : ""}
            categorySlug={recipe.categorySlug}
            licence={recipe.licence}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularFeed;
