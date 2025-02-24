"use server";

import db from "@/db";
import {
  attributes,
  categories,
  images,
  licences,
  recipeAttributes,
  recipes,
  users,
} from "@/db/schema";
import {
  and,
  count,
  eq,
  getTableColumns,
  ilike,
  inArray,
  or,
  SQL,
} from "drizzle-orm";

interface FacatedParams {
  categorySlug: string | null;
  cuisineSlugs: string[];
  occassionSlugs: string[];
  dietSlugs: string[];
  query: string | null;
}

const getFilters = ({
  categorySlug,
  cuisineSlugs,
  occassionSlugs,
  dietSlugs,
  query,
}: FacatedParams) => {
  const attributesSlugs = [...cuisineSlugs, ...occassionSlugs, ...dietSlugs];

  // Create filters and remove undefined values in one go
  const filters = [
    categorySlug && eq(categories.slug, categorySlug),
    attributesSlugs.length > 0 && inArray(attributes.slug, attributesSlugs),
    query &&
      or(
        ilike(recipes.name, `%${query}%`),
        ilike(recipes.description, `%${query}%`)
      ),
  ].filter(Boolean) as SQL<unknown>[];

  return filters;
};

export const getFilteredRecipes = async ({
  categorySlug,
  cuisineSlugs,
  occassionSlugs,
  dietSlugs,
  query,
}: FacatedParams) => {
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
    .leftJoin(recipeAttributes, eq(recipes.id, recipeAttributes.recipeId))
    .leftJoin(attributes, eq(recipeAttributes.attributeId, attributes.id))
    .where(
      and(
        ...getFilters({
          categorySlug,
          cuisineSlugs,
          occassionSlugs,
          dietSlugs,
          query,
        })
      )
    );

  return data;
};

export const countFilteredRecipes = async ({
  categorySlug,
  cuisineSlugs,
  occassionSlugs,
  dietSlugs,
  query,
}: FacatedParams) => {
  const [data] = await db
    .select({
      count: count(recipes.id),
    })
    .from(recipes)
    .innerJoin(images, eq(recipes.imageId, images.id))
    .innerJoin(users, eq(recipes.userId, users.id))
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
    .leftJoin(licences, eq(recipes.licenceId, licences.id))
    .leftJoin(recipeAttributes, eq(recipes.id, recipeAttributes.recipeId))
    .leftJoin(attributes, eq(recipeAttributes.attributeId, attributes.id))
    .where(
      and(
        ...getFilters({
          categorySlug,
          cuisineSlugs,
          occassionSlugs,
          dietSlugs,
          query,
        })
      )
    );

  return data.count;
};
