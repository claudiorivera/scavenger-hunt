"use server";

import { db } from "@claudiorivera/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessionOrThrow } from "~/lib/auth-utils";

const deleteHuntSchema = z.object({
	huntId: z.string().cuid(),
});

export async function deleteHunt(_state: unknown, formData: FormData) {
	await getSessionOrThrow();

	const input = Object.fromEntries(formData.entries());

	const validation = deleteHuntSchema.safeParse(input);

	if (!validation.success) {
		return {
			errors: validation.error.flatten().fieldErrors,
		};
	}

	await db.hunt.delete({
		where: {
			id: validation.data.huntId,
		},
	});

	redirect("/");
}
