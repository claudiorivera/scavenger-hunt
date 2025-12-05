"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "@/lib/safe-action";
import { deleteUser } from "@/server/api";

const inputSchema = zfd.formData({
	userId: zfd.text(z.string()),
});

export const deleteUserAction = actionClient
	.inputSchema(inputSchema)
	.action(async ({ parsedInput }) => deleteUser(parsedInput.userId));
