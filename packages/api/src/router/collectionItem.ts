import { TRPCError } from "@trpc/server";
import { v2 as cloudinary } from "cloudinary";
import * as z from "zod";

import { Prisma } from "@claudiorivera/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const defaultCollectionItemSelect =
	Prisma.validator<Prisma.CollectionItemSelect>()({
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
	});

export const collectionItemRouter = createTRPCRouter({
	byId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const collectionItem = await ctx.prisma.collectionItem.findUnique({
			where: { id: input },
			select: defaultCollectionItemSelect,
		});

		if (!collectionItem) throw new TRPCError({ code: "NOT_FOUND" });

		const { firstName, lastName, imageUrl } = await ctx.clerk.users.getUser(
			collectionItem.user.id,
		);

		return {
			...collectionItem,
			user: {
				id: collectionItem.user.id,
				firstName,
				lastName,
				imageUrl,
			},
		};
	}),
	delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.prisma.collectionItem.delete({
			where: { id: input },
		});
	}),
	create: protectedProcedure
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
					item: {
						connect: {
							id: input.itemId,
						},
					},
					user: {
						connectOrCreate: {
							where: {
								id: ctx.auth.userId,
							},
							create: {
								id: ctx.auth.userId,
							},
						},
					},
				},
			});
		}),
});
