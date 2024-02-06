import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		AUTH_GITHUB_ID: z.string().optional(),
		AUTH_GITHUB_SECRET: z.string().optional(),
		AUTH_SECRET:
			process.env.NODE_ENV === "production"
				? z.string()
				: z.string().optional(),
		AUTH_URL: z.preprocess(
			// This makes Vercel deployments not fail if you don't set AUTH_URL
			// Since NextAuth.js automatically uses the VERCEL_URL if present.
			(str) => process.env.VERCEL_URL ?? str,
			// VERCEL_URL doesn't include `https` so it cant be validated as a URL
			process.env.VERCEL ? z.string() : z.string().url(),
		),
		VERCEL_ENV: z.enum(["production", "preview", "development"]),
	},
	client: {},
	runtimeEnv: {
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_URL: process.env.AUTH_URL,
		AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
		AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
		VERCEL_ENV: process.env.VERCEL_ENV,
	},
	emptyStringAsUndefined: true,
	skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
