import { type Prisma } from "@claudiorivera/db";
import * as z from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

const defaultCollectionItemSelect: Prisma.CollectionItemSelect = {
	id: true,
	user: {
		select: {
			name: true,
		},
	},
	item: {
		select: {
			id: true,
			description: true,
		},
	},
	url: true,
	width: true,
	height: true,
};

export const collectionItemRouter = createTRPCRouter({
	byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
		return ctx.prisma.collectionItem.findUnique({
			where: { id: input },
			select: defaultCollectionItemSelect,
		});
	}),
	delete: adminProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.prisma.collectionItem.delete({
			where: { id: input },
		});
	}),
});
