import {
  pgEnum,
  pgTable,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { images } from "./image";

export const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof difficulties)[number];
export const difficultiesEnum = pgEnum("difficulty", difficulties);

export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  image: uuid("image").references(() => images.id, {
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
  preparationTime: varchar("preparation_time", {
    length: 255,
  }).notNull(),
  portions: smallint("portions").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Recipe = typeof recipes.$inferSelect;
export type RecipeInsert = typeof recipes.$inferInsert;

export const recipeIngredient = pgTable("recipe_ingredient", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipe_id: uuid("recipe_id")
    .notNull()
    .references(() => recipes.id, {
      onDelete: "cascade",
    }),
  ingredient: varchar("ingredient", {
    length: 255,
  }).notNull(),
  amount: varchar("amount", {
    length: 255,
  }).notNull(),
  unit: varchar("unit", {
    length: 255,
  }).notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type RecipeIngredient = typeof recipeIngredient.$inferSelect;
export type RecipeIngredientInsert = typeof recipeIngredient.$inferInsert;

export const recipeStep = pgTable("recipe_step", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipe_id: uuid("recipe_id")
    .notNull()
    .references(() => recipes.id, {
      onDelete: "cascade",
    }),
  step: varchar("step", {
    length: 255,
  }).notNull(),
  image: uuid("image").references(() => images.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type RecipeStep = typeof recipeStep.$inferSelect;
export type RecipeStepInsert = typeof recipeStep.$inferInsert;
