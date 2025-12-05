"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { joinHunt, leaveHunt } from "@/server/api";

const joinHuntSchema = z.object({
	id: z.string(),
});

export const joinHuntAction = actionClient
	.inputSchema(joinHuntSchema)
	.action(async ({ parsedInput: { id } }) => joinHunt({ id }));

export const leaveHuntAction = actionClient
	.inputSchema(joinHuntSchema)
	.action(async ({ parsedInput: { id } }) => leaveHunt({ id }));
