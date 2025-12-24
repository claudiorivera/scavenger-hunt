import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

export const Route = createFileRoute("/profile/")({
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
	const { user } = Route.useRouteContext();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<Avatar className="h-24 w-24">
					<AvatarImage
						src={user.image ?? undefined}
						alt={`${user.name ?? "Anonymous User"}'s profile picture`}
					/>
					<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
				</Avatar>
				<header className="text-2xl">{user.name ?? "Anonymous User"}</header>
				<Button variant="secondary" asChild>
					<Link to="/profile/edit">Edit Profile</Link>
				</Button>
			</div>
		</div>
	);
}
