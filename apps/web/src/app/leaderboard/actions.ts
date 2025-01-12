"use server";

import { db } from "@claudiorivera/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionOrThrow } from "~/lib/auth-utils";

const deleteUserSchema = z.object({
	userId: z.string().cuid(),
});

export async function deleteUser(_state: unknown, formData: FormData) {
	await getSessionOrThrow();

	const input = Object.fromEntries(formData.entries());

	const validation = deleteUserSchema.safeParse(input);

	if (!validation.success) {
		return {
			errors: validation.error.flatten().fieldErrors,
		};
	}

	await db.user.delete({
		where: {
			id: validation.data.userId,
		},
	});

	revalidatePath("/leaderboard");
}
