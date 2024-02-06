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
	},
	client: {},
	runtimeEnv: {
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
		AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
	},
	emptyStringAsUndefined: true,
	skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
