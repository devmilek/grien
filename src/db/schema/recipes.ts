import {
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
import { categories, cuisines, diets } from "./attributes";

export const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof difficulties)[number];
export const difficultiesEnum = pgEnum("difficulty", difficulties);

export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageId: uuid("image").references(() => images.id, {
    onDelete: "set null",
  }),
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
  category: one(categories, {
    fields: [recipes.categoryId],
    references: [categories.id],
  }),
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
  amount: varchar("amount"),
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

export const recipeDiets = pgTable(
  "recipe_diets",
  {
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, {
        onDelete: "cascade",
      }),
    dietId: uuid("diet_id")
      .notNull()
      .references(() => diets.id, {
        onDelete: "cascade",
      }),
  },
  (t) => [
    primaryKey({
      columns: [t.recipeId, t.dietId],
    }),
  ]
);

export const recipeDietsRelations = relations(recipeDiets, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeDiets.recipeId],
    references: [recipes.id],
  }),
  diet: one(diets, {
    fields: [recipeDiets.dietId],
    references: [diets.id],
  }),
}));

export type RecipeDiet = typeof recipeDiets.$inferSelect;
export type RecipeDietInsert = typeof recipeDiets.$inferInsert;

export const recipeCuisines = pgTable(
  "recipe_cuisines",
  {
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, {
        onDelete: "cascade",
      }),
    cuisineId: uuid("cuisine_id")
      .notNull()
      .references(() => cuisines.id, {
        onDelete: "cascade",
      }),
  },
  (t) => [
    primaryKey({
      columns: [t.recipeId, t.cuisineId],
    }),
  ]
);

export const recipeCuisinesRelations = relations(recipeCuisines, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeCuisines.recipeId],
    references: [recipes.id],
  }),
  cuisine: one(cuisines, {
    fields: [recipeCuisines.cuisineId],
    references: [cuisines.id],
  }),
}));

export type RecipeCuisine = typeof recipeCuisines.$inferSelect;
export type RecipeCuisineInsert = typeof recipeCuisines.$inferInsert;

export const recipeOccasions = pgTable(
  "recipe_occasions",
  {
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, {
        onDelete: "cascade",
      }),
    occasionId: uuid("occasion_id")
      .notNull()
      .references(() => cuisines.id, {
        onDelete: "cascade",
      }),
  },
  (t) => [
    primaryKey({
      columns: [t.recipeId, t.occasionId],
    }),
  ]
);

export const recipeOccasionsRelations = relations(
  recipeOccasions,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeOccasions.recipeId],
      references: [recipes.id],
    }),
    occasion: one(cuisines, {
      fields: [recipeOccasions.occasionId],
      references: [cuisines.id],
    }),
  })
);

export type RecipeOccasion = typeof recipeOccasions.$inferSelect;
export type RecipeOccasionInsert = typeof recipeOccasions.$inferInsert;
