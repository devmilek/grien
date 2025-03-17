import db from "@/db";
import { collections, collectionsRecipes } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/utils";
import { zValidator } from "@hono/zod-validator";
import { slugifyWithCounter } from "@sindresorhus/slugify";
import { and, eq, getTableColumns, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { z } from "zod";
import { rateLimiterMiddleware } from "./utils/rate-limiter-middleware";

const createCollectionLimiter = new RateLimiterMemory({
  points: 20, // 10 operacji
  duration: 60 * 10, // na godzinę
});

const readCollectionLimiter = new RateLimiterMemory({
  points: 100, // 100 operacji
  duration: 60 * 15, // na 15 minut
});

const modifyRecipeInCollectionLimiter = new RateLimiterMemory({
  points: 40, // 30 operacji
  duration: 60 * 10, // na 10 minut
});

const MAX_USER_COLLECTIONS = 30;

const createCollectionSchema = z.object({
  name: z.string().min(1).max(50),
  isPublic: z.boolean().default(false),
});

const app = new Hono()
  .post(
    "/",
    rateLimiterMiddleware(createCollectionLimiter),
    zValidator("json", createCollectionSchema),
    async (c) => {
      const { name, isPublic } = c.req.valid("json");

      const { user } = await getCurrentSession();

      if (!user) {
        return c.json(
          {
            success: false,
            message: "Musisz się zalogować aby utworzyć kolekcje",
          },
          401
        );
      }

      const userCollectionsCount = await db.$count(
        collections,
        eq(collections.userId, user.id)
      );

      if (userCollectionsCount >= MAX_USER_COLLECTIONS) {
        return c.json(
          {
            success: false,
            message: `Możesz utworzyć maksymalnie ${MAX_USER_COLLECTIONS} kolekcji`,
          },
          400
        );
      }

      const slugify = slugifyWithCounter();

      let slug = slugify(name);
      let isSlugAvailable = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!isSlugAvailable && attempts < maxAttempts) {
        const existingCollection = await db.query.collections.findFirst({
          where: eq(collections.slug, slug),
        });

        if (!existingCollection) {
          isSlugAvailable = true;
        } else {
          slug = slugify(name);
          attempts++;
        }
      }

      if (!isSlugAvailable) {
        return c.json(
          {
            success: false,
            message:
              "Nie można utworzyć unikalnego identyfikatora dla kolekcji",
          },
          500
        );
      }

      await db.insert(collections).values({
        name,
        public: isPublic,
        userId: user.id,
        slug,
      });

      return c.json({ success: true, message: "Kolekcja została utworzona" });
    }
  )
  .get(
    "/",
    rateLimiterMiddleware(readCollectionLimiter),
    zValidator(
      "query",
      z.object({
        containsRecipe: z.string().uuid().optional(),
      })
    ),
    async (c) => {
      const { user } = await getCurrentSession();
      const { containsRecipe } = c.req.valid("query");

      if (!user) {
        return c.json(
          {
            success: false,
            message: "Musisz się zalogować aby zobaczyć kolekcje",
          },
          401
        );
      }

      const userCollections = await db
        .select({
          ...getTableColumns(collections),
          count: db.$count(
            collectionsRecipes,
            eq(collectionsRecipes.collectionId, collections.id)
          ),
        })
        .from(collections)
        .where(eq(collections.userId, user.id));

      const userCollectionsIds = userCollections.map(
        (collection) => collection.id
      );

      if (containsRecipe) {
        const recipeCollections = await db.query.collectionsRecipes.findMany({
          where: and(
            eq(collectionsRecipes.recipeId, containsRecipe),
            inArray(collectionsRecipes.collectionId, userCollectionsIds)
          ),
        });

        const collectionIdsWithRecipe = new Set(
          recipeCollections.map((rc) => rc.collectionId)
        );

        const collectionsWithFlag = userCollections.map((collection) => ({
          ...collection,
          containsRecipe: collectionIdsWithRecipe.has(collection.id),
        }));

        return c.json({ success: true, data: collectionsWithFlag });
      }

      const userCollectionsWithFlag = userCollections.map((collection) => ({
        ...collection,
        containsRecipe: false,
      }));

      return c.json({ success: true, data: userCollectionsWithFlag });
    }
  )
  .post(
    "/:collectionId/recipes/:recipeId",
    rateLimiterMiddleware(modifyRecipeInCollectionLimiter),
    zValidator(
      "param",
      z.object({
        collectionId: z.string().uuid(),
        recipeId: z.string().uuid(),
      })
    ),
    async (c) => {
      const { collectionId, recipeId } = c.req.valid("param");

      const { user } = await getCurrentSession();

      if (!user) {
        return c.json(
          {
            success: false,
            message: "Musisz się zalogować aby dodać przepis do kolekcji",
          },
          401
        );
      }

      const collection = await db.query.collections.findFirst({
        where: and(
          eq(collections.id, collectionId),
          eq(collections.userId, user.id)
        ),
      });

      if (!collection) {
        return c.json(
          {
            success: false,
            message: "Nie znaleziono kolekcji",
          },
          404
        );
      }

      try {
        await db.insert(collectionsRecipes).values({
          collectionId: collection.id,
          recipeId,
        });

        return c.json({
          success: true,
          message: `Przepis został dodany do kolekcji ${collection.name}`,
        });
      } catch {
        return c.json(
          {
            success: false,
            message: "Nie udało się dodać przepisu do kolekcji",
          },
          500
        );
      }
    }
  )
  .delete(
    "/:collectionId/recipes/:recipeId",
    rateLimiterMiddleware(modifyRecipeInCollectionLimiter),
    zValidator(
      "param",
      z.object({
        collectionId: z.string().uuid(),
        recipeId: z.string().uuid(),
      })
    ),
    async (c) => {
      const { collectionId, recipeId } = c.req.valid("param");
      const { user } = await getCurrentSession();

      if (!user) {
        return c.json(
          {
            success: false,
            message: "Musisz się zalogować aby usunąć przepis z kolekcji",
          },
          401
        );
      }

      const collection = await db.query.collections.findFirst({
        where: and(
          eq(collections.id, collectionId),
          eq(collections.userId, user.id)
        ),
      });

      if (!collection) {
        return c.json(
          {
            success: false,
            message: "Nie znaleziono kolekcji",
          },
          404
        );
      }

      try {
        await db
          .delete(collectionsRecipes)
          .where(
            and(
              eq(collectionsRecipes.collectionId, collection.id),
              eq(collectionsRecipes.recipeId, recipeId)
            )
          );

        return c.json({
          success: true,
          message: `Przepis został usunięty z kolekcji ${collection.name}`,
        });
      } catch {
        return c.json(
          {
            success: false,
            message: "Nie udało się usunąć przepisu z kolekcji",
          },
          500
        );
      }
    }
  );

export default app;

// POST /collections
// Tworzy nową kolekcję (wymaga tokenu).
// Body: name, description?

// GET /users/me/collections
// Pobiera kolekcje zalogowanego użytkownika (wymaga tokenu).

// GET /collections/{id}
// Pobiera szczegóły kolekcji (publiczne lub prywatne w zależności od uprawnień).

// PUT/PATCH /collections/{id}
// Aktualizuje kolekcję (tylko autor; wymaga tokenu).

// DELETE /collections/{id}
// Usuwa kolekcję (tylko autor; wymaga tokenu).

// POST /collections/{collectionId}/recipes/{recipeId}
// Dodaje przepis do kolekcji (wymaga tokenu).

// DELETE /collections/{collectionId}/recipes/{recipeId}
// Usuwa przepis z kolekcji (wymaga tokenu).

// GET /collections/{collectionId}/recipes
// Pobiera przepisy z kolekcji (publiczne lub prywatne).
