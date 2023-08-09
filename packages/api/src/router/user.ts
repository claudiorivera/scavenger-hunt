import { z } from "zod";

import type { Prisma } from "@claudiorivera/db";

import { authedProcedure, createTRPCRouter } from "../trpc";

const defaultUserSelect: Prisma.UserSelect = {
	id: true,
};

export const userRouter = createTRPCRouter({
	me: authedProcedure.query(({ ctx }) => {
		return ctx.prisma.user.findUnique({
			where: {
				id: ctx.auth.userId,
			},
			select: {
				...defaultUserSelect,
				collectionItems: {
					select: {
						itemId: true,
					},
				},
			},
		});
	}),
	all: authedProcedure.query(({ ctx }) => {
		return ctx.prisma.user.findMany({
			orderBy: {
				collectionItems: {
					_count: "desc",
				},
			},
			select: {
				_count: {
					select: {
						collectionItems: true,
					},
				},
				id: true,
			},
		});
	}),
	byId: authedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		return ctx.prisma.user.findUnique({
			where: {
				id: input,
			},
			select: {
				...defaultUserSelect,
				collectionItems: {
					select: {
						id: true,
						url: true,
						item: {
							select: {
								description: true,
							},
						},
					},
				},
			},
		});
	}),
	withItemIdInCollection: authedProcedure
		.input(z.string())
		.query(({ ctx, input }) => {
			return ctx.prisma.user.findMany({
				where: {
					collectionItems: {
						some: {
							itemId: {
								equals: input,
							},
						},
					},
				},
				select: {
					...defaultUserSelect,
					collectionItems: {
						select: {
							id: true,
							itemId: true,
						},
					},
				},
			});
		}),
	deleteById: authedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.prisma.user.delete({
			where: {
				id: input,
			},
		});
	}),
});
