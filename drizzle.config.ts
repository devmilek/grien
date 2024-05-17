import type { Config } from "drizzle-kit";
import "dotenv/config";

if (!process.env.AUTH_DRIZZLE_URL) {
  throw new Error("DATABASE_URL environment variable is required.");
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.AUTH_DRIZZLE_URL,
  },
} satisfies Config;
