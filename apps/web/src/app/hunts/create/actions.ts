"use server";

import { db } from "@claudiorivera/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionOrThrow } from "~/lib/auth-utils";

const createHuntSchema = z.object({
	createdById: z.string().cuid2(),
});

export async function createHunt(_state: unknown, formData: FormData) {
	await getSessionOrThrow();

	const input = Object.fromEntries(formData.entries());

	const validation = createHuntSchema.safeParse(input);

	if (!validation.success) {
		return {
			errors: validation.error.flatten().fieldErrors,
		};
	}

	const hunt = await db.hunt.create({
		data: {
			createdById: validation.data.createdById,
		},
	});

	revalidatePath(`/hunts/${hunt.id}`);
}
