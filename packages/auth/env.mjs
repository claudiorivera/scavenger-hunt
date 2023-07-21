import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),
		NEXTAUTH_SECRET:
			process.env.NODE_ENV === "production"
				? z.string().min(1)
				: z.string().min(1).optional(),
		NEXTAUTH_URL: z.preprocess(
			// This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
			// Since NextAuth.js automatically uses the VERCEL_URL if present.
			(str) => process.env.VERCEL_URL ?? str,
			// VERCEL_URL doesn't include `https` so it cant be validated as a URL
			process.env.VERCEL ? z.string() : z.string().url(),
		),
		VERCEL_ENV: z.enum(["production", "preview", "development"]),
		EMAIL_SERVER: z.string().url(),
		EMAIL_FROM: z.string().email(),
	},
	client: {},
	runtimeEnv: {
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
		VERCEL_ENV: process.env.VERCEL_ENV,
		EMAIL_SERVER: process.env.EMAIL_SERVER,
		EMAIL_FROM: process.env.EMAIL_FROM,
	},
	skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
