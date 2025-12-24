import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { authMiddleware } from "@/lib/auth-middleware";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const uploadCollectionItemSchema = z.object({
	base64: z.string(),
	itemId: z.string(),
});

export type UploadCollectionItemInput = z.infer<
	typeof uploadCollectionItemSchema
>;

export const uploadCollectionItemServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(uploadCollectionItemSchema)
	.handler(async ({ data, context }) =>
		uploadToCloudinary({
			base64: data.base64,
			filename: `user_${context.user.id}-item_${data.itemId}`,
			folder: "scavenger-hunt/collection-items",
		}),
	);

export const uploadProfilePhotoServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			base64: z.string(),
		}),
	)
	.handler(async ({ data, context }) =>
		uploadToCloudinary({
			base64: data.base64,
			filename: context.user.id,
			folder: "scavenger-hunt/profile-images",
		}),
	);
