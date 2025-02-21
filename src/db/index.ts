import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/index";

const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});

export default db;
