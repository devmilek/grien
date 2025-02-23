import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

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

  isExternal: boolean("is_external").default(false),
  author: varchar("author", {
    length: 255,
  }),
  sourceUrl: varchar("source_url", {
    length: 255,
  }),
  originalTitle: varchar("original_title", {
    length: 255,
  }),
  licenseType: varchar("license_type", { length: 50 }), // np. "CC BY-NC-SA 3.0", "All rights reserved"
  licenseLink: varchar("license_link", { length: 255 }),

  uploadedBy: varchar("uploaded_by")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
});

export type Image = typeof images.$inferSelect;
export type ImageInsert = typeof images.$inferInsert;
