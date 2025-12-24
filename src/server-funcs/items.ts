import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { collectionItem, item } from "@/db/schema";
import { authMiddleware } from "@/lib/auth-middleware";

export const getItemsByHuntIdServerFn = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			huntId: z.string(),
		}),
	)
	.handler(({ data, context }) =>
		db
			.select({
				item: item,
				collectedAt: collectionItem.createdAt,
			})
			.from(item)
			.leftJoin(
				collectionItem,
				and(
					eq(collectionItem.itemId, item.id),
					eq(collectionItem.userId, context.user.id),
				),
			)
			.where(eq(item.huntId, data.huntId))
			.orderBy(desc(item.createdAt)),
	);

export const createItemServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			description: z.string().min(1),
			huntId: z.string(),
		}),
	)
	.handler(async ({ data, context }) => {
		const [result] = await db
			.insert(item)
			.values({
				...data,
				createdById: context.user.id,
			})
			.returning();

		if (!result) {
			throw new Error("Failed to create item");
		}

		return result;
	});

export const getItemByIdServerFn = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			itemId: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const result = await db.query.item.findFirst({
			where: (item, { eq }) => eq(item.id, data.itemId),
		});

		if (!result) {
			throw new Error("Item not found");
		}

		return result;
	});

export const deleteItemServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			itemId: z.string(),
		}),
	)
	.handler(async ({ data }) =>
		db.delete(item).where(eq(item.id, data.itemId)).returning(),
	);

export const getNextUncollectedItemForHuntServerFn = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			huntId: z.string(),
		}),
	)
	.handler(async ({ data, context }) =>
		db.query.item.findFirst({
			where: (item, { eq, and, notExists }) =>
				and(
					eq(item.huntId, data.huntId),
					notExists(
						db
							.select()
							.from(collectionItem)
							.where(
								and(
									eq(collectionItem.itemId, item.id),
									eq(collectionItem.userId, context.user.id),
								),
							),
					),
				),
			columns: {
				id: true,
			},
		}),
	);
