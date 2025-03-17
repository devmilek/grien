import { Hono } from "hono";
import { handle } from "hono/vercel";
import avatarRoute from "../routes/avatar-route";
import recipesRoute from "../routes/recipes-route";
import imageRoute from "../routes/image-route";
import collectionsRoute from "../routes/collections-route";
import likesRoute from "../routes/likes-route";
import commentsRoute from "@/features/comments/server/route";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api");
app.use(logger());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const router = app
  .route("/avatar", avatarRoute)
  .route("/recipes", recipesRoute)
  .route("/image", imageRoute)
  .route("/collections", collectionsRoute)
  .route("/comments", commentsRoute)
  .route("/likes", likesRoute);

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);

export type AppType = typeof router;
