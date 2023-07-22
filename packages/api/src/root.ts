import { authRouter } from "./router/auth";
import { collectionItemRouter } from "./router/collectionItem";
import { itemRouter } from "./router/item";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  items: itemRouter,
  users: userRouter,
  collectionItems: collectionItemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
