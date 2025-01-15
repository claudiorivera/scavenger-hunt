"use server";

import { db } from "@claudiorivera/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionOrThrow } from "~/lib/auth-utils";

const createItemSchema = z.object({
	description: z.string().min(1),
	huntId: z.string().cuid2(),
});

export async function createItem(_state: unknown, formData: FormData) {
	await getSessionOrThrow();

	const input = Object.fromEntries(formData.entries());

	const validation = createItemSchema.safeParse(input);

	if (!validation.success) {
		return {
			errors: validation.error.flatten().fieldErrors,
		};
	}

	await db.item.create({
		data: validation.data,
	});

	revalidatePath(`/hunts/${validation.data.huntId}/items`);
}
