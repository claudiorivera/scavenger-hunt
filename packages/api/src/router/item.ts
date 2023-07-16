import * as z from "zod";
import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "../trpc";

const addItemSchema = z.object({
	description: z.string().min(1),
});

export const itemRouter = createTRPCRouter({
	all: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.item.findMany({ orderBy: { id: "desc" } });
	}),
	byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
		return ctx.prisma.item.findUnique({ where: { id: input } });
	}),
	collected: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.item.findMany({
			where: {
				collectionItems: {
					some: {
						user: {
							id: ctx.session.user.id,
						},
					},
				},
			},
			select: {
				id: true,
				description: true,
			},
		});
	}),
	uncollected: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.item.findMany({
			where: {
				collectionItems: {
					none: {
						user: {
							id: ctx.session.user.id,
						},
					},
				},
			},
			select: {
				id: true,
				description: true,
			},
		});
	}),
	add: adminProcedure.input(addItemSchema).mutation(({ ctx, input }) => {
		return ctx.prisma.item.create({ data: input });
	}),
});
