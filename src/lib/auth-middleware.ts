import { createMiddleware } from "@tanstack/react-start";
import { getUserSession } from "@/server-funcs/auth";

export const authMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const { user } = await getUserSession();

		if (!user) {
			throw new Error("UNAUTHORIZED");
		}

		return next({
			context: {
				user,
			},
		});
	},
);
