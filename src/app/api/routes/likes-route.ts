import db from "@/db";
import { recipeLikes, recipes } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/utils";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .post(
    "/:id",
    zValidator("param", z.object({ id: z.string().uuid() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const { user } = await getCurrentSession();

      if (!user) {
        return c.json(
          {
            success: false,
            message: "Musisz być zalogowany aby polubić przepis.",
          },
          401
        );
      }

      const recipe = await db.query.recipes.findFirst({
        where: eq(recipes.id, id),
        columns: {
          id: true,
        },
      });

      if (!recipe) {
        return c.json(
          { success: false, message: "Nie znaleziono przepisu" },
          404
        );
      }

      const likeExists = await db.query.recipeLikes.findFirst({
        where: and(
          eq(recipeLikes.recipeId, recipe.id),
          eq(recipeLikes.userId, user.id)
        ),
      });

      if (likeExists) {
        await db
          .delete(recipeLikes)
          .where(
            and(
              eq(recipeLikes.recipeId, recipe.id),
              eq(recipeLikes.userId, user.id)
            )
          );

        return c.json({ success: true, message: "Usunięto polubienie" });
      }

      await db.insert(recipeLikes).values({
        recipeId: recipe.id,
        userId: user.id,
      });

      return c.json({ success: true, message: "Polubiono przepis" });
    }
  )
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().uuid() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const { user } = await getCurrentSession();

      const recipe = await db.query.recipes.findFirst({
        where: eq(recipes.id, id),
        columns: {
          id: true,
        },
      });

      if (!recipe) {
        return c.json(
          { success: false, message: "Nie znaleziono przepisu" },
          404
        );
      }

      let hasLiked = false;

      const likes = await db.$count(
        recipeLikes,
        and(eq(recipeLikes.recipeId, recipe.id))
      );

      if (user) {
        hasLiked = (await db.query.recipeLikes.findFirst({
          where: and(
            eq(recipeLikes.recipeId, recipe.id),
            eq(recipeLikes.userId, user.id)
          ),
        }))
          ? true
          : false;
      }

      return c.json({ success: true, likes, hasLiked });
    }
  );

export default app;
