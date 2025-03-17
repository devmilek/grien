import React from "react";
import ImageBackgroudCard from "@/components/cards/image-background-card";
import { cn } from "@/lib/utils";
import db from "@/db";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import {
  categories,
  images,
  licences,
  recipeLikes,
  recipes,
  users,
} from "@/db/schema";

const PopularFeed = async () => {
  const data = await db
    .select({
      ...getTableColumns(recipes),
      category: {
        name: categories.name,
        slug: categories.slug,
      },
      imageSrc: images.url,
      licence: {
        ...getTableColumns(licences),
      },
      user: {
        name: users.name,
        username: users.username,
        image: users.image,
      },
      likes: db
        .$count(recipeLikes, eq(recipeLikes.recipeId, recipes.id))
        .as("likesCount"),
    })
    .from(recipes)
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
    .innerJoin(images, eq(recipes.imageId, images.id))
    .innerJoin(users, eq(recipes.userId, users.id))
    .leftJoin(licences, eq(recipes.licenceId, licences.id))
    .orderBy(desc(sql`"likesCount"`), desc(recipes.views))
    .limit(3);
  return (
    <div className="p-6 rounded-xl bg-white">
      <h2 className="font-display text-3xl mb-5">Najpopularniejsze</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {data.map((recipe, index) => (
          <ImageBackgroudCard
            key={index}
            {...recipe}
            className={cn(index === 0 ? "md:col-span-2" : "")}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularFeed;
