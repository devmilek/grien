import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { recipes } from "./recipes";
import { users } from "./users";

export const comments = pgTable("comments", {
  id: uuid().primaryKey().defaultRandom(),
  recipeId: uuid("recipe_id")
    .notNull()
    .references(() => recipes.id, {
      onDelete: "cascade",
    }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  content: varchar("content").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Comment = typeof comments.$inferSelect;
export type CommentInsert = typeof comments.$inferInsert;
