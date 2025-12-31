import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		BETTER_AUTH_SECRET: z.string(),
		CLOUDINARY_URL: z.url(),
		CRON_SECRET: z.string(),
		DATABASE_URL: z.url(),
	},
	runtimeEnvStrict: {
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		CLOUDINARY_URL: process.env.CLOUDINARY_URL,
		CRON_SECRET: process.env.CRON_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
	},
	emptyStringAsUndefined: true,
	skipValidation: !!process.env.SKIP_VALIDATION,
});
