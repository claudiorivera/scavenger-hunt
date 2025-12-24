import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	secret: env.BETTER_AUTH_SECRET,
	logger: {
		level: process.env.NODE_ENV === "development" ? "debug" : "info",
	},
	trustedOrigins: process.env.VERCEL_URL
		? [`https://${process.env.VERCEL_URL}`]
		: [],
	user: {
		additionalFields: {
			role: {
				type: "string",
				input: false,
				default: schema.Role.user,
			},
		},
	},
});
