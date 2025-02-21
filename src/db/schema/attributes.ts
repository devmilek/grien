import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", {
    length: 100,
  }).notNull(),
  slug: varchar("slug", {
    length: 100,
  })
    .notNull()
    .unique(),
});

export type Category = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;

export const occasions = pgTable("occasions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", {
    length: 100,
  }).notNull(),
  slug: varchar("slug", {
    length: 100,
  })
    .notNull()
    .unique(),
});

export type Occasion = typeof occasions.$inferSelect;
export type OccasionInsert = typeof occasions.$inferInsert;

export const cuisines = pgTable("cuisines", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", {
    length: 100,
  }).notNull(),
  slug: varchar("slug", {
    length: 100,
  })
    .notNull()
    .unique(),
});

export type Cuisine = typeof cuisines.$inferSelect;
export type CuisineInsert = typeof cuisines.$inferInsert;

export const diets = pgTable("diets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", {
    length: 100,
  }).notNull(),
  slug: varchar("slug", {
    length: 100,
  })
    .notNull()
    .unique(),
});

export type Diet = typeof diets.$inferSelect;
export type DietInsert = typeof diets.$inferInsert;
