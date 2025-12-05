"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "@/lib/safe-action";
import { requireSessionUser, uploadCollectionItem } from "@/server/api";
import { collectionItem, db } from "@/server/db";

const inputSchema = zfd.formData({
	base64: zfd.text(),
	itemId: zfd.text(z.string()),
	huntId: zfd.text(z.string()),
});

export const createCollectionItemAction = actionClient
	.inputSchema(inputSchema)
	.action(async ({ parsedInput }) => {
		const sessionUser = await requireSessionUser();

		const { url, height, width } = await uploadCollectionItem({
			base64: parsedInput.base64,
			userId: sessionUser.id,
			itemId: parsedInput.itemId,
		});

		const [result] = await db
			.insert(collectionItem)
			.values({
				url,
				height,
				width,
				itemId: parsedInput.itemId,
				userId: sessionUser.id,
				huntId: parsedInput.huntId,
			})
			.returning({ id: collectionItem.id });

		if (!result) {
			throw new Error("Failed to create collection item");
		}

		return result;
	});
