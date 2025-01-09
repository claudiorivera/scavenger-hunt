"use server";

import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import { v2 as cloudinary } from "cloudinary";
import { redirect } from "next/navigation";
import { z } from "zod";

const createCollectionItemSchema = z.object({
	base64: z.string(),
	itemId: z.string().cuid(),
});

type State = unknown;

export async function createCollectionItem(_state: State, formData: FormData) {
	const session = await auth();

	if (!session) {
		throw Error("Unauthorized");
	}

	const input = Object.fromEntries(formData.entries());

	const validation = createCollectionItemSchema.safeParse(input);

	if (!validation.success) {
		return {
			errors: validation.error.flatten().fieldErrors,
		};
	}

	const { secure_url, height, width } = await cloudinary.uploader.upload(
		validation.data.base64,
		{
			public_id: `user_${session.user.id}-item_${validation.data.itemId}`,
			folder: "scavenger-hunt/collection-items",
		},
	);

	const collectionItem = await db.collectionItem.create({
		data: {
			url: secure_url,
			height,
			width,
			itemId: validation.data.itemId,
			userId: session.user.id,
		},
	});

	redirect(`/collection-items/${collectionItem.id}`);
}
