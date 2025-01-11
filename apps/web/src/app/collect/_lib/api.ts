import { db } from "@claudiorivera/db";
import { v2 as cloudinary } from "cloudinary";
import "server-only";
import { getSessionOrThrow } from "~/lib/auth-utils";

export async function getNextUncollectedItemForUser(userId: string) {
	await getSessionOrThrow();

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

export async function uploadToCloudinary({
	base64,
	userId,
	itemId,
}: {
	base64: string;
	userId: string;
	itemId: string;
}) {
	return cloudinary.uploader.upload(base64, {
		public_id: `user_${userId}-item_${itemId}`,
		folder: "scavenger-hunt/collection-items",
	});
}
