"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "@/lib/safe-action";
import { requireSessionUser } from "@/server/api";
import { db, item } from "@/server/db";

const inputSchema = zfd.formData({
	description: zfd.text(z.string().min(1)),
	huntId: zfd.text(z.string()),
});

export const createItemAction = actionClient
	.inputSchema(inputSchema)
	.action(async ({ parsedInput }) => {
		const sessionUser = await requireSessionUser();

		const [result] = await db
			.insert(item)
			.values({ ...parsedInput, createdById: sessionUser.id })
			.returning();

		if (!result) {
			throw new Error("Failed to create item");
		}

		return result;
	});
