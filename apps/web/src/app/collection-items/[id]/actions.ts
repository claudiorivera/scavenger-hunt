"use server";

import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import { redirect } from "next/navigation";
import { z } from "zod";

const deleteCollectionItemSchema = z.object({
	collectionItemId: z.string().cuid(),
});

type State = unknown;

export async function deleteCollectionItem(_state: State, formData: FormData) {
	const session = await auth();

	if (!session) {
		throw Error("Unauthorized");
	}

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
