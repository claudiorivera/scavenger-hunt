"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "@/lib/safe-action";
import { deleteItem } from "@/server/api";

const inputSchema = zfd.formData({
	itemId: zfd.text(z.string()),
	huntId: zfd.text(z.string()),
});

export const deleteItemAction = actionClient
	.inputSchema(inputSchema)
	.action(async ({ parsedInput }) => deleteItem(parsedInput.itemId));
