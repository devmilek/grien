import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const licences = pgTable("licences", {
  id: uuid().primaryKey().defaultRandom(),

  author: varchar("author", {
    length: 255,
  }).notNull(),
  sourceUrl: varchar("source_url", {
    length: 255,
  }).notNull(),
  originalTitle: varchar("original_title", {
    length: 255,
  }),
  licenseType: varchar("license_type", { length: 50 }).notNull(), // np. "CC BY-NC-SA 3.0", "All rights reserved"
  licenseLink: varchar("license_link", { length: 255 }).notNull(),
});

export type Licence = typeof licences.$inferSelect;
export type LicenceInsert = typeof licences.$inferInsert;
