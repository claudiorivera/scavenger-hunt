import "server-only";

import { db } from "@claudiorivera/db";
import { v2 as cloudinary } from "cloudinary";
import { getSessionOrThrow } from "~/lib/auth-utils";

export async function getNextUncollectedItemIdForUser(userId: string) {
	await getSessionOrThrow();

	const item = await db.item.findFirst({
		where: {
			collectionItems: {
				none: {
					user: {
						id: userId,
					},
				},
			},
		},
		select: {
			id: true,
		},
	});

	return item?.id;
}

export async function getItemByIdOrThrow(itemId: string) {
	await getSessionOrThrow();

	return db.item.findUniqueOrThrow({
		where: {
			id: itemId,
		},
	});
}

export async function uploadProfileImage({
	base64,
	userId,
}: {
	base64: string;
	userId: string;
}) {
	await getSessionOrThrow();

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
	await getSessionOrThrow();

	const { secure_url, height, width } = await cloudinary.uploader.upload(
		base64,
		{
			public_id: `user_${userId}-item_${itemId}`,
			folder: "scavenger-hunt/collection-items",
		},
	);

	return { url: secure_url, height, width };
}

export async function getCollectionItem(id: string) {
	await getSessionOrThrow();

	return db.collectionItem.findUniqueOrThrow({
		where: { id },
		include: {
			user: {
				select: {
					id: true,
					name: true,
				},
			},
			item: {
				select: {
					id: true,
					description: true,
				},
			},
		},
	});
}

export async function getCurrentUser() {
	const session = await getSessionOrThrow();

	return db.user.findUniqueOrThrow({
		where: {
			id: session.user.id,
		},
		include: {
			collectionItems: true,
		},
	});
}

export async function getItems() {
	const session = await getSessionOrThrow();

	const items = await db.item.findMany({
		include: {
			collectionItems: true,
		},
	});

	const mappedItems = items.reduce(
		(map, item) => {
			const isCollected = item.collectionItems.some(
				(collectionItem) => collectionItem.userId === session.user.id,
			);

			map.set(isCollected ? "collected" : "uncollected", [
				...(map.get(isCollected ? "collected" : "uncollected") ?? []),
				item,
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

export async function getUsersWhoCollectedItem(itemId: string) {
	await getSessionOrThrow();

	return db.user.findMany({
		where: {
			collectionItems: {
				some: {
					itemId: {
						equals: itemId,
					},
				},
			},
		},
		include: {
			collectionItems: {
				select: {
					id: true,
					itemId: true,
				},
			},
		},
	});
}

export async function getLeaderboardUsers() {
	await getSessionOrThrow();

	return db.user.findMany({
		include: {
			_count: true,
		},
	});
}

export async function getUserById(id: string) {
	await getSessionOrThrow();

	return db.user.findUniqueOrThrow({
		where: {
			id,
		},
		include: {
			collectionItems: {
				include: {
					item: true,
				},
			},
		},
	});
}

export type UserWithCollectionItems = Awaited<
	ReturnType<typeof getUsersWhoCollectedItem>
>[number];
