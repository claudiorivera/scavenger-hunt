import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.user) {
			throw redirect({ to: "/sign-in" });
		}

		return {
			user: context.user,
		};
	},
});

function RouteComponent() {
	return <div>Hello "/admin/"!</div>;
}
