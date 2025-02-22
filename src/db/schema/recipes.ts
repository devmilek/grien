import {
  pgEnum,
  pgTable,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { images } from "./image";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof difficulties)[number];
export const difficultiesEnum = pgEnum("difficulty", difficulties);

export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageId: uuid("image").references(() => images.id, {
    onDelete: "set null",
  }),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  slug: varchar("slug", {
    length: 255,
  })
    .notNull()
    .unique(),
  description: varchar("description", {
    length: 500,
  }).notNull(),
  difficulty: difficultiesEnum("difficulty").notNull(),
  preparationTime: smallint("preparation_time").notNull(),
  portions: smallint("portions").notNull(),
  userId: varchar("user_id")
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

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  image: one(images, {
    fields: [recipes.imageId],
    references: [images.id],
  }),
  user: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
  ingredients: many(recipeIngredients),
  steps: many(recipeSteps),
}));

export type Recipe = typeof recipes.$inferSelect;
export type RecipeInsert = typeof recipes.$inferInsert;

export const recipeIngredients = pgTable("recipe_ingredients", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipe_id: uuid("recipe_id")
    .notNull()
    .references(() => recipes.id, {
      onDelete: "cascade",
    }),
  ingredient: varchar("ingredient", {
    length: 255,
  }).notNull(),
  amount: smallint("amount"),
  unit: varchar("unit", {
    length: 255,
  }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const recipeIngredientsRelations = relations(
  recipeIngredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeIngredients.recipe_id],
      references: [recipes.id],
    }),
  })
);

export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type RecipeIngredientInsert = typeof recipeIngredients.$inferInsert;

export const recipeSteps = pgTable("recipe_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipe_id: uuid("recipe_id")
    .notNull()
    .references(() => recipes.id, {
      onDelete: "cascade",
    }),
  content: varchar("content", {
    length: 500,
  }).notNull(),
  order: smallint("order").notNull(),
  image: uuid("image").references(() => images.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const recipeStepsRelations = relations(recipeSteps, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeSteps.recipe_id],
    references: [recipes.id],
  }),
  image: one(images, {
    fields: [recipeSteps.image],
    references: [images.id],
  }),
}));

export type RecipeStep = typeof recipeSteps.$inferSelect;
export type RecipeStepInsert = typeof recipeSteps.$inferInsert;
