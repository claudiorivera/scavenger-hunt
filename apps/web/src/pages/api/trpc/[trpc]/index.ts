import { createNextApiHandler } from "@trpc/server/adapters/next";

import { appRouter, createTRPCContext } from "@claudiorivera/api";

export default createNextApiHandler({
	router: appRouter,
	createContext: createTRPCContext,
});
