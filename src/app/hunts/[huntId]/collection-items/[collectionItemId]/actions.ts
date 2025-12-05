"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "@/lib/safe-action";
import { deleteCollectionItem } from "@/server/api";

const inputSchema = zfd.formData({
	collectionItemId: zfd.text(z.string()),
});

export const deleteCollectionItemAction = actionClient
	.inputSchema(inputSchema)
	.action(async ({ parsedInput }) => {
		const [collectionItem] = await deleteCollectionItem(
			parsedInput.collectionItemId,
		);

		if (!collectionItem) {
			throw new Error("Collection Item not found");
		}

		return collectionItem;
	});
