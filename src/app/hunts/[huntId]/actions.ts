"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "@/lib/safe-action";
import { deleteHunt } from "@/server/api";

const inputSchema = zfd.formData({
	huntId: zfd.text(z.string()),
});

export const deleteHuntAction = actionClient
	.inputSchema(inputSchema)
	.action(async ({ parsedInput }) => deleteHunt(parsedInput.huntId));
