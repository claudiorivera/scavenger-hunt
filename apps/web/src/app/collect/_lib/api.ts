import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";

export async function getNextUncollectedItemForUser(userId: string) {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthorized");
	}

	return db.item.findFirst({
		where: {
			collectionItems: {
				none: {
					user: {
						id: userId,
					},
				},
			},
		},
	});
}

export async function getNextUncollectedItemIdForUser(userId: string) {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthorized");
	}

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

export async function getItemById(itemId: string) {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthorized");
	}

	return db.item.findUnique({
		where: {
			id: itemId,
		},
	});
}
