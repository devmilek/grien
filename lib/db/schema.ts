import { relations } from "drizzle-orm";
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  varchar,
  pgEnum,
  boolean,
  smallint,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const typeEnum = pgEnum("type", ["occasion", "cuisine", "diet"]);

// AUTHJS SCHEMA

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: varchar("password", {
    length: 255,
  }),
  image: text("image"),
  bio: text("bio"),
});

export const userRelations = relations(users, ({ many }) => ({
  recipes: many(recipe),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const recipe = pgTable("recipe", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  difficulty: difficultyEnum("difficulty").default("easy").notNull(),
  preparationTime: integer("preparation_time").notNull(),
  published: boolean("published").default(false).notNull(),
  servings: smallint("servings").notNull(),
  categoryId: integer("category_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recipeRelations = relations(recipe, ({ one, many }) => ({
  user: one(users, {
    fields: [recipe.userId],
    references: [users.id],
  }),
  preparationSteps: many(preparationStep),
  ingredients: many(ingredient),
  category: one(category, {
    fields: [recipe.categoryId],
    references: [category.id],
  }),
  attributes: many(attributesToRecipes),
}));

export const preparationStep = pgTable("preparation_step", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipe.id, {
      onDelete: "cascade",
    }),
  description: text("description").notNull(),
  position: smallint("position").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
});

export const preparationStepRelations = relations(
  preparationStep,
  ({ one }) => ({
    recipeId: one(recipe, {
      fields: [preparationStep.recipeId],
      references: [recipe.id],
    }),
  }),
);

export const ingredient = pgTable("ingredient", {
  id: serial("id").primaryKey(),
  quantity: smallint("quantity"),
  unit: varchar("unit", { length: 50 }),
  name: varchar("name", { length: 256 }).notNull(),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipe.id, {
      onDelete: "cascade",
    }),
});

export const ingredientRelations = relations(ingredient, ({ one }) => ({
  recipeId: one(recipe, {
    fields: [ingredient.recipeId],
    references: [recipe.id],
  }),
}));

export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  image: varchar("image", { length: 500 }).notNull(),
});

export const categoryRelations = relations(category, ({ many }) => ({
  recipes: many(recipe),
}));

export const recipeAttribute = pgTable("recipe_attribute", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  type: typeEnum("type").notNull(),
});

export const recipeAttributeRelations = relations(
  recipeAttribute,
  ({ many }) => ({
    attributesToRecipes: many(attributesToRecipes),
  }),
);

export const attributesToRecipes = pgTable(
  "attributes_to_recipes",
  {
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipe.id, { onDelete: "cascade" }),
    attributeId: integer("attribute_id")
      .notNull()
      .references(() => recipeAttribute.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.recipeId, t.attributeId],
    }),
  }),
);

export const attributesToRecipesRelations = relations(
  attributesToRecipes,
  ({ one }) => ({
    recipeId: one(recipe, {
      fields: [attributesToRecipes.recipeId],
      references: [recipe.id],
    }),
    attributeId: one(recipeAttribute, {
      fields: [attributesToRecipes.attributeId],
      references: [recipeAttribute.id],
    }),
  }),
);
