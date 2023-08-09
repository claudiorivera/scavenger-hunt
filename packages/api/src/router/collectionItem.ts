import { v2 as cloudinary } from "cloudinary";
import * as z from "zod";

import type { Prisma } from "@claudiorivera/db";

import {
	adminProcedure,
	authedProcedure,
	createTRPCRouter,
	publicProcedure,
} from "../trpc";

const defaultCollectionItemSelect: Prisma.CollectionItemSelect = {
	id: true,
	user: {
		select: {
			id: true,
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
	create: authedProcedure
		.input(
			z.object({
				base64: z.string(),
				itemId: z.string().cuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { secure_url, height, width } = await cloudinary.uploader.upload(
				input.base64,
				{
					public_id: `user_${ctx.auth.userId}-item_${input.itemId}`,
					folder: "scavenger-hunt/collection-items",
				},
			);

			return ctx.prisma.collectionItem.create({
				data: {
					url: secure_url,
					height,
					width,
					itemId: input.itemId,
					userId: ctx.auth.userId,
				},
			});
		}),
});
