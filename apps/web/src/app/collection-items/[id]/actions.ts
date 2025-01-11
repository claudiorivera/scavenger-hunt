"use server";

import { db } from "@claudiorivera/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessionOrThrow } from "~/lib/auth-utils";

const deleteCollectionItemSchema = z.object({
	collectionItemId: z.string().cuid(),
});

export async function deleteCollectionItem(
	_state: unknown,
	formData: FormData,
) {
	await getSessionOrThrow();

	const input = Object.fromEntries(formData.entries());

	const validation = deleteCollectionItemSchema.safeParse(input);

	if (!validation.success) {
		return {
			errors: validation.error.flatten().fieldErrors,
		};
	}

	await db.collectionItem.delete({
		where: {
			id: validation.data.collectionItemId,
		},
	});

	redirect("/leaderboard");
}
