import { createId } from "@paralleldrive/cuid2";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { collectionItem, hunt, item, participation } from "@/db/schema";
import { authMiddleware } from "@/lib/auth-middleware";

export const joinHuntServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			huntId: z.string(),
		}),
	)
	.handler(async ({ data, context }) => {
		const [newParticipation] = await db
			.insert(participation)
			.values({
				huntId: data.huntId,
				userId: context.user.id,
			})
			.returning();

		return newParticipation;
	});

export const getAvailableHuntsServerFn = createServerFn()
	.middleware([authMiddleware])
	.handler(async ({ context }) =>
		db.query.hunt.findMany({
			where: (hunts, { notExists, eq, and }) =>
				notExists(
					db
						.select()
						.from(participation)
						.where(
							and(
								eq(participation.huntId, hunts.id),
								eq(participation.userId, context.user.id),
							),
						),
				),
			with: {
				createdBy: true,
			},
		}),
	);

export const createHuntInputSchema = z.object({
	items: z
		.array(
			z.object({
				description: z.string().or(z.literal("")),
			}),
		)
		.transform((items) =>
			items.filter((item) => item.description.trim().length > 0),
		)
		.refine((items) => items.length > 0, {
			error: "At least one item is required",
		}),
});

export const createHuntServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(createHuntInputSchema)
	.handler(async ({ data, context }) => {
		const huntId = createId();

		return db.transaction(async (transaction) => {
			const [newHunt] = await transaction
				.insert(hunt)
				.values({
					id: huntId,
					createdById: context.user.id,
				})
				.returning({
					id: hunt.id,
				});

			await transaction.insert(item).values(
				data.items.map((itemData) => ({
					...itemData,
					huntId,
					createdById: context.user.id,
				})),
			);

			await transaction.insert(participation).values({
				huntId,
				userId: context.user.id,
			});

			if (!newHunt) {
				throw new Error("Failed to create hunt");
			}

			return newHunt;
		});
	});

export const getHuntByIdServerFn = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const huntById = await db.query.hunt.findFirst({
			where: (hunt, { eq }) => eq(hunt.id, data.id),
			with: {
				createdBy: true,
			},
		});

		if (!huntById) {
			throw new Error("Hunt not found");
		}

		return huntById;
	});

export const leaveHuntServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			huntId: z.string(),
		}),
	)
	.handler(async ({ data, context }) =>
		db.transaction(async (transaction) => {
			await transaction
				.delete(collectionItem)
				.where(
					and(
						eq(collectionItem.huntId, data.huntId),
						eq(collectionItem.userId, context.user.id),
					),
				);

			const [deletedParticipation] = await transaction
				.delete(participation)
				.where(
					and(
						eq(participation.huntId, data.huntId),
						eq(participation.userId, context.user.id),
					),
				)
				.returning();

			return deletedParticipation;
		}),
	);

export const deleteHuntServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			huntId: z.string(),
		}),
	)
	.handler(async ({ data }) =>
		db.delete(hunt).where(eq(hunt.id, data.huntId)).returning(),
	);
