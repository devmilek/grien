import { Hono } from "hono";
import { handle } from "hono/vercel";
import avatarRoute from "../routes/avatar-route";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const router = app.route("/avatar", avatarRoute);

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);

export type AppType = typeof router;
