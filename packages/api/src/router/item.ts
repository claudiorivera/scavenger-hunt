import * as z from "zod";

import { Prisma } from "@claudiorivera/db";
import { createItemSchema } from "@claudiorivera/shared";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const defaultItemSelect = Prisma.validator<Prisma.ItemSelect>()({
	id: true,
	description: true,
});

export const itemRouter = createTRPCRouter({
	byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
		return ctx.prisma.item.findUnique({
			where: { id: input },
			select: defaultItemSelect,
		});
	}),
	collected: protectedProcedure.query(({ ctx }) => {
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
			select: defaultItemSelect,
		});
	}),
	uncollected: protectedProcedure.query(({ ctx }) => {
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
			select: defaultItemSelect,
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
				select: defaultItemSelect,
			});
		}),
	add: protectedProcedure.input(createItemSchema).mutation(({ ctx, input }) => {
		return ctx.prisma.item.create({ data: input });
	}),
	delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.prisma.item.delete({ where: { id: input } });
	}),
});
