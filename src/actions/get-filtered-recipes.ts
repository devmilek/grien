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
  categorySlug?: string | null;
  cuisineSlugs?: string[];
  occassionSlugs?: string[];
  dietSlugs?: string[];
  query?: string | null;
  page?: number;
}

const getFilters = ({
  categorySlug,
  cuisineSlugs,
  occassionSlugs,
  dietSlugs,
  query,
}: FacatedParams) => {
  const attributesSlugs = [];

  if (cuisineSlugs) {
    attributesSlugs.push(...cuisineSlugs);
  }

  if (occassionSlugs) {
    attributesSlugs.push(...occassionSlugs);
  }

  if (dietSlugs) {
    attributesSlugs.push(...dietSlugs);
  }

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
  page,
}: FacatedParams) => {
  const dbQuery = db
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
    )
    .limit(10);

  if (page) {
    dbQuery.offset(page * 10);
  }

  const data = await dbQuery;

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
