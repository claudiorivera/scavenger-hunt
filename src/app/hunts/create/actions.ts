"use server";

import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "@/lib/safe-action";
import { createHuntWithItems, requireSessionUser } from "@/server/api";

const inputSchema = zfd.formData(
	z.object({
		items: z.array(
			z.object({
				description: z.string(),
			}),
		),
	}),
);

export const createHuntAction = actionClient
	.inputSchema(inputSchema)
	.action(async ({ parsedInput }) => {
		const huntId = createId();
		const sessionUser = await requireSessionUser();

		return createHuntWithItems({
			huntId,
			createdById: sessionUser.id,
			items: parsedInput.items,
		});
	});
