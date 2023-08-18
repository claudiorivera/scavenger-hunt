import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const clerkRouter = createTRPCRouter({
	userById: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.clerk.users.getUser(input);
	}),
	all: protectedProcedure.query(({ ctx }) => {
		return ctx.clerk.users.getUserList();
	}),
});
