"use server";

import { httpBatchLink, loggerLink } from "@trpc/client";
import { experimental_createTRPCNextAppDirServer as createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import { headers } from "next/headers";

import type { AppRouter } from "@claudiorivera/api";
import { getUrl, transformer } from "~/app/trpc/shared";

export const api = createTRPCNextAppDirServer<AppRouter>({
	config() {
		return {
			transformer,
			links: [
				loggerLink({
					enabled: (op) =>
						process.env.NODE_ENV === "development" ||
						(op.direction === "down" && op.result instanceof Error),
				}),
				httpBatchLink({
					url: getUrl(),
					headers() {
						// Forward headers from the browser to the API
						return {
							...Object.fromEntries(headers()),
							"x-trpc-source": "rsc",
						};
					},
				}),
			],
		};
	},
});
