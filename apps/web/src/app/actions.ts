"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessionOrThrow } from "~/lib/auth-utils";
import { joinHunt, leaveHunt } from "~/server/api";

const joinHuntSchema = z.object({
	huntId: z.string().cuid2(),
});

export async function joinHuntAction({
	huntId,
}: {
	huntId: string;
}) {
	await getSessionOrThrow();

	const validation = joinHuntSchema.safeParse({ huntId });

	if (!validation.success) {
		return {
			errors: validation.error.flatten().fieldErrors,
		};
	}

	const hunt = await joinHunt({
		huntId: validation.data.huntId,
	});

	redirect(`/hunts/${hunt.huntId}`);
}

export async function leaveHuntAction({
	huntId,
}: {
	huntId: string;
}) {
	await getSessionOrThrow();

	const validation = joinHuntSchema.safeParse({ huntId });

	if (!validation.success) {
		return {
			errors: validation.error.flatten().fieldErrors,
		};
	}

	await leaveHunt({
		huntId: validation.data.huntId,
	});

	redirect("/");
}
