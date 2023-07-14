import { authRouter } from "./router/auth";
import { itemRouter } from "./router/item";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	item: itemRouter,
	auth: authRouter,
	user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
