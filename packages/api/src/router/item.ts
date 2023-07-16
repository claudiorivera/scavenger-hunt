import { type Prisma } from "@claudiorivera/db";
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
	next: protectedProcedure
		.input(
			z
				.object({
					skipItemIds: z.array(z.string()),
				})
				.optional(),
		)
		.query(({ ctx, input }) => {
			const where: Prisma.ItemWhereInput = {
				collectionItems: {
					none: {
						user: {
							id: ctx.session.user.id,
						},
					},
				},
			};

			if (input?.skipItemIds) {
				where.id = {
					notIn: input.skipItemIds,
				};
			}

			return ctx.prisma.item.findFirst({
				where,
				select: {
					id: true,
					description: true,
				},
			});
		}),
	add: adminProcedure.input(addItemSchema).mutation(({ ctx, input }) => {
		return ctx.prisma.item.create({ data: input });
	}),
	delete: adminProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.prisma.item.delete({ where: { id: input } });
	}),
});
