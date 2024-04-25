"use server";

import {
  categories,
  cuisines,
  diets,
  occasions,
} from "@/data/placeholder-data";
import { db } from "@/lib/db";
import { category, recipeAttribute } from "@/lib/db/schema";
import slugify from "@sindresorhus/slugify";

export const seedUtilityData = async () => {
  for (const item of categories) {
    await db.insert(category).values({
      name: item.name,
      image: item.image,
      slug: slugify(item.name),
    });
  }

  for (const occasion of occasions) {
    await db.insert(recipeAttribute).values({
      name: occasion,
      type: "occasion",
      slug: slugify(occasion),
    });
  }

  for (const cuisine of cuisines) {
    await db.insert(recipeAttribute).values({
      name: cuisine,
      type: "cuisine",
      slug: slugify(cuisine),
    });
  }

  for (const diet of diets) {
    await db.insert(recipeAttribute).values({
      name: diet,
      type: "diet",
      slug: slugify(diet),
    });
  }
};
