import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { collectionItem, participation, user } from "@/db/schema";
import { authMiddleware } from "@/lib/auth-middleware";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const getUsersWhoCollectedItemServerFn = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			itemId: z.string(),
		}),
	)
	.handler(async ({ data }) =>
		db.query.user.findMany({
			where: (users, { exists, eq, and }) =>
				exists(
					db
						.select()
						.from(collectionItem)
						.where(
							and(
								eq(collectionItem.itemId, data.itemId),
								eq(collectionItem.userId, users.id),
							),
						),
				),
			with: {
				collectionItems: {
					where: (collectionItem, { eq }) =>
						eq(collectionItem.itemId, data.itemId),
					columns: {
						id: true,
						itemId: true,
					},
				},
			},
		}),
	);

export type UserWithCollectionItems = Awaited<
	ReturnType<typeof getUsersWhoCollectedItemServerFn>
>[number];

export const getUserWithCollectionItemsForHuntServerFn = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			userId: z.string(),
			huntId: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const result = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.id, data.userId),
			with: {
				collectionItems: {
					where: (collectionItem, { eq }) =>
						eq(collectionItem.huntId, data.huntId),
					columns: {
						id: true,
						itemId: true,
						url: true,
					},
					with: {
						item: {
							columns: {
								description: true,
							},
						},
					},
				},
			},
		});

		if (!result) {
			throw new Error("User not found");
		}

		return result;
	});

export const getUsersByHuntIdServerFn = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			huntId: z.string(),
		}),
	)
	.handler(async ({ data }) =>
		db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				emailVerified: user.emailVerified,
				image: user.image,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				role: user.role,
				collectionItems: count(collectionItem.id),
			})
			.from(user)
			.innerJoin(participation, eq(user.id, participation.userId))
			.leftJoin(
				collectionItem,
				and(
					eq(user.id, collectionItem.userId),
					eq(collectionItem.huntId, data.huntId),
				),
			)
			.where(eq(participation.huntId, data.huntId))
			.groupBy(user.id)
			.orderBy(desc(count(collectionItem.id))),
	);

export const deleteUserServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			userId: z.string(),
		}),
	)
	.handler(async ({ data }) =>
		db.delete(user).where(eq(user.id, data.userId)).returning(),
	);

export const editProfileServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			name: z.string().optional(),
			base64: z.string().optional(),
		}),
	)
	.handler(async ({ data, context }) => {
		const [result] = await db
			.update(user)
			.set({
				image: data.base64
					? await uploadToCloudinary({
							base64: data.base64,
							filename: context.user.id,
							folder: "scavenger-hunt/profile-images",
						}).then(({ url }) => url)
					: undefined,
				name: data.name ?? undefined,
			})
			.where(eq(user.id, context.user.id))
			.returning();

		if (!result) {
			throw new Error("Failed to update profile");
		}

		return result;
	});
