"use server";
import { db } from "@claudiorivera/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import { uploadToCloudinary } from "~/app/collect/_lib/api";
import { getSessionOrThrow } from "~/lib/auth-utils";

const createCollectionItemSchema = z.object({
	base64: z.string(),
	itemId: z.string().cuid(),
});

export async function createCollectionItem(
	_state: unknown,
	formData: FormData,
) {
	const session = await getSessionOrThrow();

	const input = Object.fromEntries(formData.entries());

	const validation = createCollectionItemSchema.safeParse(input);

	if (!validation.success) {
		return {
			errors: validation.error.flatten().fieldErrors,
		};
	}

	const { secure_url, height, width } = await uploadToCloudinary({
		base64: validation.data.base64,
		userId: session.user.id,
		itemId: validation.data.itemId,
	});

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
