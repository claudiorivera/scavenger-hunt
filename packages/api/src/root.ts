import { clerkRouter } from "./router/clerk";
import { collectionItemRouter } from "./router/collectionItem";
import { itemRouter } from "./router/item";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	clerk: clerkRouter,
	collectionItem: collectionItemRouter,
	item: itemRouter,
	user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
