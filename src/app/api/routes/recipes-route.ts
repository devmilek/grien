import db from "@/db";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
  attributes,
  categories,
  collectionsRecipes,
  images,
  licences,
  recipeAttributes,
  recipes,
  users,
} from "@/db/schema";
import { and, eq, getTableColumns, ilike, inArray, or } from "drizzle-orm";

const paramsSchema = z.object({
  searchQuery: z.string().optional(),
  categorySlug: z.string().optional(),
  username: z.string().optional(),
  cuisineSlugs: z.array(z.string()).default([]),
  occassionSlugs: z.array(z.string()).default([]),
  dietSlugs: z.array(z.string()).default([]),
  page: z.number().int().positive().default(1),
  collectionId: z.string().uuid().optional(),
});

const LIMIT = 10;

const app = new Hono().post(
  "/",
  zValidator("json", paramsSchema),
  async (c) => {
    const {
      page,
      categorySlug,
      cuisineSlugs,
      dietSlugs,
      occassionSlugs,
      searchQuery,
      username,
      collectionId,
    } = c.req.valid("json");

    console.log({
      page,
      categorySlug,
      cuisineSlugs,
      dietSlugs,
      occassionSlugs,
      searchQuery,
      username,
    });

    const attributesSlugs = [...cuisineSlugs, ...occassionSlugs, ...dietSlugs];

    try {
      const dbQuery = db
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
            eq(recipes.status, "published"),
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
        .limit(LIMIT)
        .offset((page - 1) * LIMIT);

      if (collectionId) {
        dbQuery.rightJoin(
          collectionsRecipes,
          eq(recipes.id, collectionsRecipes.recipeId)
        );
      }

      console.log({ collectionId });

      const data = await dbQuery;

      return c.json(data);
    } catch {
      return c.json(
        { success: false, message: "Błąd podczas pobierania przepisów" },
        500
      );
    }
  }
);

export default app;
