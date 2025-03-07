import {
  boolean,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { recipes } from "./recipes";

export const favouriteRecipes = pgTable(
  "favourite_recipes",
  {
    userId: uuid()
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    recipeId: uuid()
      .notNull()
      .references(() => recipes.id, {
        onDelete: "cascade",
      }),
  },
  (t) => [
    primaryKey({
      columns: [t.userId, t.recipeId],
    }),
  ]
);

export const favouriteRecipesRelations = relations(
  favouriteRecipes,
  ({ one }) => ({
    user: one(users, {
      fields: [favouriteRecipes.userId],
      references: [users.id],
    }),
    recipe: one(recipes, {
      fields: [favouriteRecipes.recipeId],
      references: [recipes.id],
    }),
  })
);

export type FavouriteRecipe = typeof favouriteRecipes.$inferSelect;
export type FavouriteRecipeInsert = typeof favouriteRecipes.$inferInsert;

export const collections = pgTable("collections", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({
    length: 100,
  }).notNull(),
  slug: varchar({
    length: 100,
  })
    .notNull()
    .unique(),

  public: boolean().notNull().default(false),

  userId: uuid()
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id],
  }),
  recipes: many(collectionsRecipes),
}));

export type Collection = typeof collections.$inferSelect;
export type CollectionInsert = typeof collections.$inferInsert;

export const collectionsRecipes = pgTable(
  "collections_recipes",
  {
    collectionId: uuid()
      .notNull()
      .references(() => collections.id, {
        onDelete: "cascade",
      }),
    recipeId: uuid()
      .notNull()
      .references(() => recipes.id, {
        onDelete: "cascade",
      }),
  },
  (t) => [
    primaryKey({
      columns: [t.collectionId, t.recipeId],
    }),
  ]
);

export const collectionsRecipesRelations = relations(
  collectionsRecipes,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionsRecipes.collectionId],
      references: [collections.id],
    }),
    recipe: one(recipes, {
      fields: [collectionsRecipes.recipeId],
      references: [recipes.id],
    }),
  })
);

export type CollectionRecipe = typeof collectionsRecipes.$inferSelect;
export type CollectionRecipeInsert = typeof collectionsRecipes.$inferInsert;
