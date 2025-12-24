import "@dotenvx/dotenvx/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as relations from "@/db/relations";
import * as schema from "@/db/schema";
import { env } from "@/env.ts";

const pool = new Pool({
	connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
	schema: {
		...schema,
		...relations,
	},
});
