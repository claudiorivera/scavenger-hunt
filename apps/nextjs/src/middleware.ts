import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: ["/api/cron-handler"],
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
