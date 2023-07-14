import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const itemRouter = createTRPCRouter({
	all: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.item.findMany({ orderBy: { id: "desc" } });
	}),
	byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
		return ctx.prisma.item.findUnique({ where: { id: input } });
	}
	),
});
