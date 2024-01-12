"use client";

import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";

import type { AppRouter } from "@claudiorivera/api";

import { getBaseUrl, transformer } from "./shared";

export const api = createTRPCNext<AppRouter>({
	config() {
		return {
			transformer,
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === "development" ||
						(opts.direction === "down" && opts.result instanceof Error),
				}),
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
					headers() {
						return {
							"x-trpc-source": "client",
						};
					},
				}),
			],
		};
	},
	/**
	 * Whether tRPC should await queries when server rendering pages.
	 *
	 * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
	 */
	ssr: false,
});

/** Export type helpers */
export type * from "./shared";
