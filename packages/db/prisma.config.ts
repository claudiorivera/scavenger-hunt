import { config } from "@dotenvx/dotenvx";
import type { PrismaConfig } from "prisma";

config({
	path: "../../.env",
});

export default {
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "tsx ./run-seed.ts",
	},
} satisfies PrismaConfig;
