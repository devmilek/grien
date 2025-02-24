import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const follows = pgTable(
  "follows",
  {
    followerId: varchar("follower_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    followingId: varchar("following_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
  },
  (t) => [
    primaryKey({
      columns: [t.followerId, t.followingId],
    }),
  ]
);
