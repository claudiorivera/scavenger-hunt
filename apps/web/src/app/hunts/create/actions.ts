"use server";

import { db } from "@claudiorivera/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessionOrThrow } from "~/lib/auth-utils";

const createHuntSchema = z.record(
	z.string().regex(/^items\.\d+\.description$/),
	z.string(),
);

export async function createHunt(_state: unknown, formData: FormData) {
	const session = await getSessionOrThrow();

	const input = Object.fromEntries(formData.entries());

	const validation = createHuntSchema.safeParse(input);

	if (!validation.success) {
		const fieldErrors = validation.error.flatten().fieldErrors;

		console.error({ fieldErrors });

		return {
			errors: fieldErrors,
		};
	}

	const hunt = await db.hunt.create({
		data: {
			createdById: session.user.id,
			items: {
				createMany: {
					data: Object.entries(validation.data).map(([_key, value]) => ({
						description: value,
						createdById: session.user.id,
					})),
				},
			},
			participants: {
				create: {
					userId: session.user.id,
				},
			},
		},
	});

	redirect(`/hunts/${hunt.id}`);
}
