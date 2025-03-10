import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { images } from "./image";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { attributes, categories } from "./attributes";
import { licences } from "./licences";

export const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof difficulties)[number];
export const difficultiesEnum = pgEnum("difficulty", difficulties);

export const recipeStatuses = ["draft", "published"] as const;
export type RecipeStatus = (typeof recipeStatuses)[number];
export const statusesEnum = pgEnum("status", recipeStatuses);

export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageId: uuid("image_id")
    .references(() => images.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
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
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  status: statusesEnum("status").notNull().default("draft"),

  views: integer("views").notNull().default(0),

  // additional if recipe is from external source
  licenceId: uuid("licence_id").references(() => licences.id, {
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
  category: one(categories, {
    fields: [recipes.categoryId],
    references: [categories.id],
  }),
  attributes: many(recipeAttributes),
  licence: one(licences, {
    fields: [recipes.licenceId],
    references: [licences.id],
  }),
}));

// Źródło: Homemade Pizza Dough z makebetterfood.com.
// Licencja: CC BY-NC-SA 3.0.
// Ten przepis został przetłumaczony na język polski i dostosowany do miar metrycznych. Możesz go udostępniać i modyfikować na tych samych warunkach.

export type Recipe = typeof recipes.$inferSelect;
export type RecipeInsert = typeof recipes.$inferInsert;

export const recipeIngredients = pgTable("recipe_ingredients", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipeId: uuid("recipe_id")
    .notNull()
    .references(() => recipes.id, {
      onDelete: "cascade",
    }),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  amount: numeric("amount", {
    precision: 5,
    scale: 2,
  }),
  unit: varchar("unit", {
    length: 255,
  }),
});

export const recipeIngredientsRelations = relations(
  recipeIngredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeIngredients.recipeId],
      references: [recipes.id],
    }),
  })
);

export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type RecipeIngredientInsert = typeof recipeIngredients.$inferInsert;

export const recipeSteps = pgTable("recipe_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipeId: uuid("recipe_id")
    .notNull()
    .references(() => recipes.id, {
      onDelete: "cascade",
    }),
  content: varchar("content", {
    length: 500,
  }).notNull(),
  order: smallint("order").notNull(),
  imageId: uuid("image").references(() => images.id, {
    onDelete: "set null",
  }),
});

export const recipeStepsRelations = relations(recipeSteps, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeSteps.recipeId],
    references: [recipes.id],
  }),
  image: one(images, {
    fields: [recipeSteps.imageId],
    references: [images.id],
  }),
}));

export type RecipeStep = typeof recipeSteps.$inferSelect;
export type RecipeStepInsert = typeof recipeSteps.$inferInsert;

export const recipeAttributes = pgTable(
  "recipe_attributes",
  {
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, {
        onDelete: "cascade",
      }),
    attributeId: uuid("attribute_id")
      .notNull()
      .references(() => attributes.id, {
        onDelete: "cascade",
      }),
  },
  (t) => [
    primaryKey({
      columns: [t.recipeId, t.attributeId],
    }),
  ]
);

export const recipeAttributesRelation = relations(
  recipeAttributes,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeAttributes.recipeId],
      references: [recipes.id],
    }),
    attribute: one(attributes, {
      fields: [recipeAttributes.attributeId],
      references: [attributes.id],
    }),
  })
);

export type RecipeAttribute = typeof recipeAttributes.$inferSelect;
export type RecipeAttributeInsert = typeof recipeAttributes.$inferInsert;

export const recipeLikes = pgTable(
  "recipe_likes",
  {
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
  },
  (t) => [
    primaryKey({
      columns: [t.recipeId, t.userId],
    }),
  ]
);
