import "server-only";

import { v2 as cloudinary } from "cloudinary";
import { and, count, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
	type CollectionItem,
	db,
	type Hunt,
	type Item,
	type User,
} from "@/server/db";
import {
	collectionItem,
	hunt,
	item,
	participation,
	user,
} from "@/server/db/schema";

export class AuthenticationError extends Error {
	constructor(message = "You must be logged in to perform this action") {
		super(message);
		this.name = "AuthenticationError";
	}
}

export async function getSessionUser() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return session?.user;
}

export async function requireSessionUser() {
	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		throw new AuthenticationError();
	}

	return sessionUser;
}

export async function getNextUncollectedItemId({
	userId,
	huntId,
}: {
	userId: string;
	huntId: string;
}) {
	const result = await db.query.item.findFirst({
		where: (item, { eq, and, notExists }) =>
			and(
				eq(item.huntId, huntId),
				notExists(
					db
						.select()
						.from(collectionItem)
						.where(
							and(
								eq(collectionItem.itemId, item.id),
								eq(collectionItem.userId, userId),
							),
						),
				),
			),
		columns: {
			id: true,
		},
	});

	return result?.id;
}

export async function getItemByIdOrThrow(id: Item["id"]) {
	const result = await db.query.item.findFirst({
		where: eq(item.id, id),
	});

	if (!result) {
		throw new Error(`Item with id ${id} not found`);
	}

	return result;
}

export async function uploadProfileImage({
	base64,
	userId,
}: {
	base64: string;
	userId: string;
}) {
	const { secure_url, height, width } = await cloudinary.uploader.upload(
		base64,
		{
			public_id: `${userId}`,
			folder: "scavenger-hunt/profile-images",
		},
	);

	return { url: secure_url, height, width };
}

export async function uploadCollectionItem({
	base64,
	userId,
	itemId,
}: {
	base64: string;
	userId: string;
	itemId: string;
}) {
	const { secure_url, height, width } = await cloudinary.uploader.upload(
		base64,
		{
			public_id: `user_${userId}-item_${itemId}`,
			folder: "scavenger-hunt/collection-items",
		},
	);

	return { url: secure_url, height, width };
}

export async function getCollectionItemOrThrow(id: CollectionItem["id"]) {
	const result = await db.query.collectionItem.findFirst({
		where: (collectionItem, { eq }) => eq(collectionItem.id, id),
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
		throw new Error(`Collection item with id ${id} not found`);
	}

	return result;
}

export async function getCurrentUserWithCollectionItemsOrThrow() {
	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		return null;
	}

	const result = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, sessionUser.id),
		with: {
			collectionItems: {
				columns: {
					id: true,
					itemId: true,
				},
			},
		},
	});

	if (!result) {
		throw new Error("User not found");
	}

	return result;
}

export async function getItemsForHunt(id: Hunt["id"]) {
	const sessionUser = await requireSessionUser();

	const items = await db.query.item.findMany({
		where: (item, { eq }) => eq(item.huntId, id),
		with: {
			collectionItems: {
				columns: {
					id: true,
					userId: true,
				},
			},
		},
	});

	const mappedItems = items.reduce(
		(map, itemData) => {
			const isCollected = itemData.collectionItems.some(
				(collectionItem) => collectionItem.userId === sessionUser?.id,
			);

			map.set(isCollected ? "collected" : "uncollected", [
				...(map.get(isCollected ? "collected" : "uncollected") ?? []),
				itemData,
			]);

			return map;
		},
		new Map<"collected" | "uncollected", typeof items>([
			["collected", []],
			["uncollected", []],
		]),
	);

	return {
		collectedItems: mappedItems.get("collected"),
		uncollectedItems: mappedItems.get("uncollected"),
		totalItems: items.length,
	};
}

export async function getUsersWhoCollectedItem(id: Item["id"]) {
	return db.query.user.findMany({
		where: (users, { exists, eq, and }) =>
			exists(
				db
					.select()
					.from(collectionItem)
					.where(
						and(
							eq(collectionItem.itemId, id),
							eq(collectionItem.userId, users.id),
						),
					),
			),
		with: {
			collectionItems: {
				where: (collectionItem, { eq }) => eq(collectionItem.itemId, id),
				columns: {
					id: true,
					itemId: true,
				},
			},
		},
	});
}

export async function getLeaderboardUsersForHunt(id: Hunt["id"]) {
	return db
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
			and(eq(user.id, collectionItem.userId), eq(collectionItem.huntId, id)),
		)
		.where(eq(participation.huntId, id))
		.groupBy(user.id)
		.orderBy(desc(count(collectionItem.id)));
}

export async function getUserByIdOrThrow(id: User["id"]) {
	const result = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, id),
		with: {
			collectionItems: {
				with: {
					item: true,
				},
			},
		},
	});

	if (!result) {
		throw new Error(`User with id ${id} not found`);
	}

	return result;
}

export async function getAvailableHunts() {
	const sessionUser = await requireSessionUser();

	return db.query.hunt.findMany({
		where: (hunts, { notExists, eq, and }) =>
			notExists(
				db
					.select()
					.from(participation)
					.where(
						and(
							eq(participation.huntId, hunts.id),
							eq(participation.userId, sessionUser.id),
						),
					),
			),
		with: {
			createdBy: true,
		},
	});
}

export async function getMyParticipations() {
	const sessionUser = await requireSessionUser();

	return db.query.participation.findMany({
		where: (participation, { eq }) => eq(participation.userId, sessionUser.id),
		with: {
			hunt: {
				with: {
					createdBy: true,
				},
			},
		},
	});
}

export async function joinHunt({ id }: { id: Hunt["id"] }) {
	const sessionUser = await requireSessionUser();

	const [newParticipation] = await db
		.insert(participation)
		.values({
			huntId: id,
			userId: sessionUser.id,
		})
		.returning();

	return newParticipation;
}

export async function leaveHunt({ id }: { id: Hunt["id"] }) {
	const sessionUser = await requireSessionUser();

	return db.transaction(async (transaction) => {
		await transaction
			.delete(collectionItem)
			.where(
				and(
					eq(collectionItem.huntId, id),
					eq(collectionItem.userId, sessionUser.id),
				),
			);

		const [deletedParticipation] = await transaction
			.delete(participation)
			.where(
				and(
					eq(participation.huntId, id),
					eq(participation.userId, sessionUser.id),
				),
			)
			.returning();

		return deletedParticipation;
	});
}

export type UserWithCollectionItems = Awaited<
	ReturnType<typeof getUsersWhoCollectedItem>
>[number];

export async function getHuntOrThrow(id: Hunt["id"]) {
	const result = await db.query.hunt.findFirst({
		where: (hunt, { eq }) => eq(hunt.id, id),
		with: {
			createdBy: true,
		},
	});

	if (!result) {
		throw new Error(`Hunt with id ${id} not found`);
	}

	return result;
}

export async function deleteHunt(id: Hunt["id"]) {
	return db.delete(hunt).where(eq(hunt.id, id)).returning();
}

export async function deleteCollectionItem(id: CollectionItem["id"]) {
	return db.delete(collectionItem).where(eq(collectionItem.id, id)).returning();
}

export async function deleteItem(id: Item["id"]) {
	return db.delete(item).where(eq(item.id, id)).returning();
}

export async function deleteUser(id: User["id"]) {
	return db.delete(user).where(eq(user.id, id)).returning();
}

export async function createHuntWithItems({
	huntId,
	createdById,
	items,
}: {
	huntId: string;
	createdById: string;
	items: Array<{ description: string }>;
}) {
	return db.transaction(async (transaction) => {
		const [newHunt] = await transaction
			.insert(hunt)
			.values({
				id: huntId,
				createdById,
			})
			.returning({
				id: hunt.id,
			});

		await transaction.insert(item).values(
			items.map((itemData) => ({
				...itemData,
				huntId,
				createdById,
			})),
		);

		await transaction.insert(participation).values({
			huntId,
			userId: createdById,
		});

		if (!newHunt) {
			throw new Error("Failed to create hunt");
		}

		return newHunt;
	});
}
