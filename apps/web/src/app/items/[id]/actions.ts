"use server";

import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import { redirect } from "next/navigation";
import { z } from "zod";

const deleteItemSchema = z.object({
	itemId: z.string().cuid(),
});

type State = unknown;

export async function deleteItem(_state: State, formData: FormData) {
	const session = await auth();

	if (!session) {
		throw Error("Unauthorized");
	}

	const input = Object.fromEntries(formData.entries());

	const validation = deleteItemSchema.safeParse(input);

	if (!validation.success) {
		return {
			errors: validation.error.flatten().fieldErrors,
		};
	}

	await db.item.delete({
		where: {
			id: validation.data.itemId,
		},
	});

	redirect("/items");
}
