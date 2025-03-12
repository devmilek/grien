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
import { and, eq, getTableColumns, ilike, inArray, or } from "drizzle-orm";
import { NextRequest } from "next/server";

const MAX_ITEMS = 10;

const parseStringArrayParam = (param: string | null) => {
  return param ? param.split(",") : [];
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const searchQuery = searchParams.get("query");
    const categorySlug = searchParams.get("categorySlug");
    const username = searchParams.get("username");
    const cuisineSlugs = parseStringArrayParam(
      searchParams.get("cuisineSlugs")
    );
    const occassionSlugs = parseStringArrayParam(
      searchParams.get("occassionSlugs")
    );
    const dietSlugs = parseStringArrayParam(searchParams.get("dietSlugs"));
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(MAX_ITEMS), 10) || MAX_ITEMS,
      MAX_ITEMS
    );
    const page = Math.max(
      parseInt(searchParams.get("page") || "1", 10) || 1,
      1
    );

    const attributesSlugs = [...cuisineSlugs, ...occassionSlugs, ...dietSlugs];

    console.log("attributesSlugs", attributesSlugs);

    const query = db
      .selectDistinct({
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
          searchQuery
            ? or(
                ilike(recipes.name, `%${searchQuery}%`),
                ilike(recipes.description, `%${searchQuery}%`)
              )
            : undefined,
          categorySlug ? eq(categories.slug, categorySlug) : undefined,
          attributesSlugs.length > 0
            ? inArray(attributes.slug, attributesSlugs)
            : undefined,
          username ? eq(users.username, username) : undefined
        )
      )
      .limit(limit)
      .offset((page - 1) * limit);

    const data = await query;

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return Response.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}
