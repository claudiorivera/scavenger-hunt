import { authRouter } from "./router/auth";
import { itemRouter } from "./router/item";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	item: itemRouter,
	auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
