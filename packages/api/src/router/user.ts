import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	me: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.user.findUnique({
			where: {
				id: ctx.session.user.id,
			},
		});
	}),
	all: protectedProcedure.query(({ ctx }) => {
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
				image: true,
				name: true,
			},
		});
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
