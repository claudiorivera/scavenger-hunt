import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { collectionItem } from "@/db/schema";
import { authMiddleware } from "@/lib/auth-middleware";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const createCollectionItemServerFn = createServerFn({
	method: "POST",
})
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			huntId: z.string(),
			itemId: z.string(),
			base64: z.string(),
		}),
	)
	.handler(async ({ data, context }) => {
		const { url, height, width } = await uploadToCloudinary({
			base64: data.base64,
			filename: `user_${context.user.id}-item_${data.itemId}`,
			folder: "scavenger-hunt/collection-items",
		});

		const [result] = await db
			.insert(collectionItem)
			.values({
				url,
				height,
				width,
				itemId: data.itemId,
				huntId: data.huntId,
				userId: context.user.id,
			})
			.returning({ id: collectionItem.id });

		if (!result) {
			throw new Error("Failed to create collection item");
		}

		return result;
	});

export const getCollectionItemWithUserAndItemByIdServerFn = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const result = await db.query.collectionItem.findFirst({
			where: (collectionItem, { eq }) => eq(collectionItem.id, data.id),
			with: {
				user: {
					columns: {
						id: true,
						name: true,
					},
				},
				item: {
					columns: {
						id: true,
						description: true,
					},
				},
			},
		});

		if (!result) {
			throw new Error(`Collection item with id ${data.id} not found`);
		}

		return result;
	});

export const deleteCollectionItemServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const [deletedItem] = await db
			.delete(collectionItem)
			.where(eq(collectionItem.id, data.id))
			.returning();

		if (!deletedItem) {
			throw new Error(`Error deleting collection item with id ${data.id}`);
		}

		return deletedItem;
	});
