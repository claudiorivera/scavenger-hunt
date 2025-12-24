import { createFileRoute } from "@tanstack/react-router";
import { seed } from "@/db/seed";

export const Route = createFileRoute("/api/cron-handler/")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const authorization = request.headers.get("Authorization");

				if (authorization === `Bearer ${process.env.CRON_SECRET}`) {
					await seed();

					return Response.json({ message: "Success" });
				}

				return Response.json(
					{ message: "Unauthorized" },
					{
						status: 401,
					},
				);
			},
		},
	},
});
