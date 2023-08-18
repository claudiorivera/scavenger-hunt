import { collectionItemRouter } from "./router/collectionItem";
import { itemRouter } from "./router/item";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	item: itemRouter,
	user: userRouter,
	collectionItem: collectionItemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
