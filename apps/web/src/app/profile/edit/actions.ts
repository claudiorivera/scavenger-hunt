"use server";

import { db } from "@claudiorivera/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessionOrThrow } from "~/lib/auth-utils";
import { uploadProfileImage } from "~/server/api";

const editProfileSchema = z.object({
	name: z.string().nullish(),
	base64: z.string().nullish(),
});

export async function editProfile(_state: unknown, formData: FormData) {
	const session = await getSessionOrThrow();

	const input = Object.fromEntries(formData.entries());

	const validation = editProfileSchema.safeParse(input);

	if (!validation.success) {
		return {
			errors: validation.error.flatten().fieldErrors,
		};
	}

	await db.user.update({
		where: {
			id: session.user.id,
		},
		data: {
			image: validation.data.base64
				? await uploadProfileImage({
						base64: validation.data.base64,
						userId: session.user.id,
					}).then(({ url }) => url)
				: undefined,
			name: validation.data.name,
		},
	});

	redirect("/profile");
}
