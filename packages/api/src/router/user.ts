import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	me: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.user.findUnique({
			where: {
				id: ctx.session.user.id,
			},
		});
	}),
});
