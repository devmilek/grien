import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const attributesTypes = ["cuisines", "diets", "occasions"] as const;
export type AttributesType = (typeof attributesTypes)[number];
export const attributesTypesEnum = pgEnum("attributes_type", attributesTypes);

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

export const attributes = pgTable("attributes", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: attributesTypesEnum("type").notNull(),
  name: varchar("name", {
    length: 100,
  }).notNull(),
  slug: varchar("slug", {
    length: 100,
  })
    .notNull()
    .unique(),
});

export type Attribute = typeof attributes.$inferSelect;
export type AttributeInsert = typeof attributes.$inferInsert;
