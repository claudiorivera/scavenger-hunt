import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Prisma } from "@claudiorivera/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const defaultUserSelect: Prisma.UserSelect = {
	id: true,
};

export const userRouter = createTRPCRouter({
	me: protectedProcedure.query(({ ctx }) => {
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
	all: protectedProcedure.query(async ({ ctx }) => {
		const users = await ctx.prisma.user.findMany({
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

		const usersWithClerk = await Promise.all(
			users.map(async (user) => {
				const { firstName, lastName, imageUrl } = await ctx.clerk.users.getUser(
					user.id,
				);

				return {
					...user,
					firstName,
					lastName,
					imageUrl,
				};
			}),
		);

		return usersWithClerk;
	}),
	byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const user = await ctx.prisma.user.findUnique({
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

		if (!user) throw new TRPCError({ code: "NOT_FOUND" });

		const { firstName, lastName, imageUrl } = await ctx.clerk.users.getUser(
			user.id,
		);

		return {
			...user,
			firstName,
			lastName,
			imageUrl,
		};
	}),
	withItemIdInCollection: protectedProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const users = await ctx.prisma.user.findMany({
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

			const usersWithClerk = await Promise.all(
				users.map(async (user) => {
					const clerkUser = await ctx.clerk.users.getUser(user.id);

					return {
						...user,
						...clerkUser,
						id: user.id,
					};
				}),
			);

			return usersWithClerk;
		}),
	deleteById: protectedProcedure
		.input(z.string())
		.mutation(({ ctx, input }) => {
			return ctx.prisma.user.delete({
				where: {
					id: input,
				},
			});
		}),
});
