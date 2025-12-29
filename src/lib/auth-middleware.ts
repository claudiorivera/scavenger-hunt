import { createMiddleware } from "@tanstack/react-start";
import { getUserSessionServerFn } from "@/server-funcs/auth";

export const authMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const { user } = await getUserSessionServerFn();

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
