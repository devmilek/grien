"use server";

import db from "@/db";
import { comments, recipes, users } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { commentSchema } from "./schema";

export const getRecipeComments = async (recipeId: string) => {
  const data = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      user: {
        id: users.id,
        name: users.name,
      },
    })
    .from(comments)
    .where(eq(comments.recipeId, recipeId))
    .innerJoin(users, eq(users.id, comments.userId));

  return data;
};

export const createComment = async (recipeId: string, content: string) => {
  try {
    const { user } = await getCurrentSession();

    const validatedFields = commentSchema.safeParse({
      content,
    });

    if (!validatedFields.success) {
      return {
        status: 400,
        message: "Bad Request",
      };
    }

    if (!user) {
      return {
        status: 401,
        message: "Unauthorized",
      };
    }

    const recipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, recipeId),
    });

    if (!recipe) {
      return {
        status: 404,
        message: "Not Found",
      };
    }

    await db.insert(comments).values({
      content,
      userId: user.id,
      recipeId,
    });

    return {
      status: 201,
      message: "Created",
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};
