import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { authMiddleware } from "@/lib/auth-middleware";

export const getMyParticipationsServerFn = createServerFn()
	.middleware([authMiddleware])
	.handler(async ({ context }) =>
		db.query.participation.findMany({
			where: (participation, { eq }) =>
				eq(participation.userId, context.user.id),
			with: {
				hunt: {
					with: {
						createdBy: true,
					},
				},
			},
		}),
	);
