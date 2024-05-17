import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const pool = new Pool({ connectionString: process.env.AUTH_DRIZZLE_URL! });

// const sql = neon(process.env.AUTH_DRIZZLE_URL!);
export const db = drizzle(pool, { schema });
