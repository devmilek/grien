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
import { and, eq, getTableColumns, ilike, inArray, or, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";

const MAX_ITEMS = 10;

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

const parseStringArrayParam = (param: string | null) => {
  return param ? param.split(",") : [];
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const searchQuery = searchParams.get("query");
  const categorySlug = searchParams.get("categorySlug");
  const cuisineSlugs = parseStringArrayParam(searchParams.get("cuisineSlugs"));
  const occassionSlugs = parseStringArrayParam(
    searchParams.get("occassionSlugs")
  );
  const dietSlugs = parseStringArrayParam(searchParams.get("dietSlugs"));
  const limit = Math.min(
    parseInt(searchParams.get("limit") || "10", 10),
    MAX_ITEMS
  );
  const page = parseInt(searchParams.get("page") || "1", 10);

  const query = db
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
      searchQuery
        ? or(
            ilike(recipes.name, `%${searchQuery}%`),
            ilike(recipes.description, `%${searchQuery}%`)
          )
        : undefined
    )
    .limit(10);

  if (page) {
    query.offset(page * 10);
  }

  const data = await query;

  return Response.json({
    searchQuery,
    categorySlug,
    cuisineSlugs,
    occassionSlugs,
    dietSlugs,
    data,
  });
}
