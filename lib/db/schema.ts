import { relations } from "drizzle-orm";
import {
  bigint,
  binary,
  boolean,
  datetime,
  int,
  mediumint,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  smallint,
  text,
  timestamp,
  tinyint,
  tinytext,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  name: tinytext("name").notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  emailVerified: datetime("email_verified", { mode: "string" }),
  imageUrl: varchar("image_url", { length: 500 }),
  password: binary("password", { length: 60 }),
  bio: tinytext("bio"),
});

export const userRelations = relations(user, ({ many }) => ({
  recipes: many(recipe),
}));

export const recipe = mysqlTable("recipe", {
  id: int("id").notNull().autoincrement().primaryKey(),
  name: tinytext("name").notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"])
    .default("easy")
    .notNull(),
  preparationTime: int("preparation_time").notNull(),
  published: boolean("published").default(false).notNull(),
  servings: tinyint("servings").notNull(),
  categoryId: int("category_id").notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),

  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const recipeRelations = relations(recipe, ({ one, many }) => ({
  userId: one(user, {
    fields: [recipe.userId],
    references: [user.id],
  }),
  preparationSteps: many(preparationStep),
  ingredients: many(ingredient),
  category: one(category, {
    fields: [recipe.categoryId],
    references: [category.id],
  }),
  attributesToRecipes: many(attributesToRecipes),
}));

export const preparationStep = mysqlTable("preparation_step", {
  id: mediumint("id").autoincrement().primaryKey(),
  recipeId: int("recipe_id").notNull(),
  description: text("description").notNull(),
  position: tinyint("position").notNull(),
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

export const ingredient = mysqlTable("ingredient", {
  id: int("id").primaryKey().autoincrement().notNull(),
  quantity: smallint("quantity"),
  unit: varchar("unit", { length: 50 }),
  name: varchar("name", { length: 256 }).notNull(),
  recipeId: int("recipe_id").notNull(),
});

export const ingredientRelations = relations(ingredient, ({ one }) => ({
  recipeId: one(recipe, {
    fields: [ingredient.recipeId],
    references: [recipe.id],
  }),
}));

export const category = mysqlTable("category", {
  id: int("id").primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  image: varchar("image", { length: 500 }),
});

export const categoryRelations = relations(category, ({ many }) => ({
  recipes: many(recipe),
}));

export const recipeAttribute = mysqlTable("recipe_attribute", {
  id: int("id").primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  type: mysqlEnum("type", ["occasion", "cuisine", "diet"]).notNull(),
});

export const recipeAttributeRelations = relations(
  recipeAttribute,
  ({ many }) => ({
    attributesToRecipes: many(attributesToRecipes),
  }),
);

export const attributesToRecipes = mysqlTable(
  "attributes_to_recipes",
  {
    recipeId: int("recipe_id")
      .notNull()
      .references(() => recipe.id, { onDelete: "cascade" }),
    attributeId: int("attribute_id")
      .notNull()
      .references(() => recipeAttribute.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey(t.recipeId, t.attributeId),
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
