import { type Prisma } from "@claudiorivera/db";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const updateProfileSchema = z.object({
	base64: z.string().optional(),
	name: z.string().optional(),
});

const defaultUserSelect: Prisma.UserSelect = {
	id: true,
	name: true,
	image: true,
};

async function uploadPhoto({
	base64,
	userId,
}: {
	base64: string;
	userId: string;
}) {
	try {
		const { secure_url, height, width } = await cloudinary.uploader.upload(
			base64,
			{
				public_id: `${userId}`,
				folder: "scavenger-hunt/profile-photos",
			},
		);

		return { url: secure_url, height, width };
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export const userRouter = createTRPCRouter({
	me: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.user.findUnique({
			where: {
				id: ctx.session.user.id,
			},
			select: {
				...defaultUserSelect,
				collectionItems: {
					select: {
						itemId: true,
					},
				},
				role: true,
			},
		});
	}),
	all: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.user.findMany({
			orderBy: {
				collectionItems: {
					_count: "desc",
				},
			},
			select: {
				_count: {
					select: {
						collectionItems: true,
					},
				},
				id: true,
				image: true,
				name: true,
			},
		});
	}),
	byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		return ctx.prisma.user.findUnique({
			where: {
				id: input,
			},
			select: {
				...defaultUserSelect,
				collectionItems: {
					select: {
						id: true,
						url: true,
						item: {
							select: {
								description: true,
							},
						},
					},
				},
			},
		});
	}),
	withItemIdInCollection: protectedProcedure
		.input(z.string())
		.query(({ ctx, input }) => {
			return ctx.prisma.user.findMany({
				where: {
					collectionItems: {
						some: {
							itemId: {
								equals: input,
							},
						},
					},
				},
				select: {
					...defaultUserSelect,
					collectionItems: {
						select: {
							id: true,
							itemId: true,
						},
					},
				},
			});
		}),
	deleteById: protectedProcedure
		.input(z.string())
		.mutation(({ ctx, input }) => {
			return ctx.prisma.user.delete({
				where: {
					id: input,
				},
			});
		}),
	update: protectedProcedure
		.input(updateProfileSchema)
		.mutation(async ({ ctx, input }) => {
			let imageUrl;
			if (input.base64) {
				const { url } = await uploadPhoto({
					base64: input.base64,
					userId: ctx.session.user.id,
				});
				imageUrl = url;
			}

			return ctx.prisma.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					image: imageUrl,
					name: input.name,
				},
			});
		}),
});