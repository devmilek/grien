import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const images = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: varchar("url").notNull(),
  alt: varchar("alt", {
    length: 255,
  }),
  key: varchar("key", {
    length: 255,
  }).notNull(),
  mimeType: varchar("mimeType", {
    length: 255,
  }).notNull(),
  size: integer("size").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Image = typeof images.$inferSelect;
export type ImageInsert = typeof images.$inferInsert;
