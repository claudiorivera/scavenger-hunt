"use server";
import { db } from "@claudiorivera/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createItemSchema = z.object({
	description: z.string().min(1),
});

type State = unknown;

export async function createItem(_state: State, formData: FormData) {
	const input = Object.fromEntries(formData.entries());

	const validation = createItemSchema.safeParse(input);

	if (!validation.success) {
		return {
			errors: validation.error.flatten().fieldErrors,
		};
	}

	await db.item.create({
		data: validation.data,
	});

	revalidatePath("/items");
}
