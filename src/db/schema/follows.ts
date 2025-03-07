import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const follows = pgTable(
  "follows",
  {
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    followingId: uuid("following_id")
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
