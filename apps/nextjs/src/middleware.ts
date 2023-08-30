import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

export default authMiddleware({
	afterAuth(auth, request) {
		const source = request.headers.get("x-trpc-source");

		const isExpoRequest = source === "expo";

		if (!auth.userId && !auth.isPublicRoute) {
			if (isExpoRequest)
				return NextResponse.json(
					{
						error: "UNAUTHORIZED",
					},
					{
						status: 401,
					},
				);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return redirectToSignIn({
				returnBackUrl: request.url,
			});
		}
	},
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
