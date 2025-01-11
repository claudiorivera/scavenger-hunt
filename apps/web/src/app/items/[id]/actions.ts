"use server";

import { db } from "@claudiorivera/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessionOrThrow } from "~/lib/auth-utils";

const deleteItemSchema = z.object({
	itemId: z.string().cuid(),
});

export async function deleteItem(_state: unknown, formData: FormData) {
	await getSessionOrThrow();

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
