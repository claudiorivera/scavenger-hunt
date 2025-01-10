"use server";

import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import { v2 as cloudinary } from "cloudinary";
import { redirect } from "next/navigation";
import { z } from "zod";

const editProfileSchema = z.object({
	name: z.string().nullish(),
	base64: z.string().nullish(),
});

type State = unknown;

export async function editProfile(_state: State, formData: FormData) {
	const session = await auth();

	if (!session) {
		throw Error("Unauthorized");
	}

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
				? await uploadImage({
						base64: validation.data.base64,
						userId: session.user.id,
					}).then(({ url }) => url)
				: undefined,
			name: validation.data.name,
		},
	});

	redirect("/profile");
}

async function uploadImage({
	base64,
	userId,
}: {
	base64: string;
	userId: string;
}) {
	try {
		const { secure_url, height, width } = await cloudinary.uploader.upload(
			base64,
			{
				public_id: `${userId}`,
				folder: "scavenger-hunt/profile-images",
			},
		);

		return { url: secure_url, height, width };
	} catch (error) {
		console.error(error);
		throw error;
	}
}
