"use server";

import { eq } from "drizzle-orm";
import z from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "@/lib/safe-action";
import { requireSessionUser, uploadProfileImage } from "@/server/api";
import { db, user as userTable } from "@/server/db";

const inputSchema = zfd.formData({
	name: zfd.text(z.string().optional()),
	base64: zfd.text(z.string().optional()),
});

export const editProfileAction = actionClient
	.inputSchema(inputSchema)
	.action(async ({ parsedInput }) => {
		const sessionUser = await requireSessionUser();

		const [result] = await db
			.update(userTable)
			.set({
				image: parsedInput.base64
					? await uploadProfileImage({
							base64: parsedInput.base64,
							userId: sessionUser.id,
						}).then(({ url }) => url)
					: undefined,
				name: parsedInput.name ?? undefined,
			})
			.where(eq(userTable.id, sessionUser.id))
			.returning();

		if (!result) {
			throw new Error("Failed to update profile");
		}

		return result;
	});
