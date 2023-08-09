import * as z from "zod";

import type { Prisma } from "@claudiorivera/db";
import { createItemSchema } from "@claudiorivera/shared";

import {
	adminProcedure,
	authedProcedure,
	createTRPCRouter,
	publicProcedure,
} from "../trpc";

export const itemRouter = createTRPCRouter({
	all: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.item.findMany({ orderBy: { id: "desc" } });
	}),
	byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
		return ctx.prisma.item.findUnique({ where: { id: input } });
	}),
	collected: authedProcedure.query(({ ctx }) => {
		return ctx.prisma.item.findMany({
			where: {
				collectionItems: {
					some: {
						user: {
							id: ctx.auth.userId,
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
	uncollected: authedProcedure.query(({ ctx }) => {
		return ctx.prisma.item.findMany({
			where: {
				collectionItems: {
					none: {
						user: {
							id: ctx.auth.userId,
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
	next: authedProcedure
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
							id: ctx.auth.userId,
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
	add: adminProcedure.input(createItemSchema).mutation(({ ctx, input }) => {
		return ctx.prisma.item.create({ data: input });
	}),
	delete: adminProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.prisma.item.delete({ where: { id: input } });
	}),
});
