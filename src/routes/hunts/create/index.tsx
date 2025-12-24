import { createFileRoute, redirect } from "@tanstack/react-router";
import { CreateHuntForm } from "@/routes/hunts/create/-components/create-hunt-form";

export const Route = createFileRoute("/hunts/create/")({
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
	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-2xl">Create a Hunt</h1>

			<CreateHuntForm />
		</div>
	);
}
