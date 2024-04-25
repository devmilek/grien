// import { drizzle } from "drizzle-orm/planetscale-serverless";
// import { connect } from "@planetscale/database";
// import * as schema from "./schema";

// const connection = connect({
//   url: process.env.DATABASE_URL,
// });

// export const db = drizzle(connection, { schema });

import * as schema from "./schema";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });
