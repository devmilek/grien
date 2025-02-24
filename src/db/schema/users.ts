import {
  pgTable,
  text,
  timestamp,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  email: varchar("email", {
    length: 320,
  })
    .notNull()
    .unique(),
  username: varchar("username", {
    length: 30,
  }).unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  bio: varchar("bio", {
    length: 500,
  }),

  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export type User = typeof users.$inferSelect;

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: varchar("ip_address", {
    length: 45,
  }),
  userAgent: varchar("user_agent", {
    length: 255,
  }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey(),
  accountId: varchar("account_id").notNull(),
  providerId: varchar("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: varchar("id").primaryKey(),
  identifier: varchar("identifier").notNull(),
  value: varchar("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
