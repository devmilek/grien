import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const images = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: varchar("url").notNull().unique(),
  key: varchar("key", {
    length: 255,
  })
    .notNull()
    .unique(),
  mimeType: varchar("mimeType", {
    length: 255,
  }),
  size: integer("size"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  uploadedBy: uuid("uploaded_by")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
});

export type Image = typeof images.$inferSelect;
export type ImageInsert = typeof images.$inferInsert;
