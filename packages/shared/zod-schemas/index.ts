import { z } from "zod";

export const createItemSchema = z.object({
	description: z.string().min(1),
});

export const uploadImageSchema = z.object({
	base64: z.string(),
	itemId: z.string().cuid(),
});

export const updateProfileSchema = z.object({
	name: z.string().nullish(),
	base64: z.string().nullish(),
});
