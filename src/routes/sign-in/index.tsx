import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

export const Route = createFileRoute("/sign-in/")({
	beforeLoad: async ({ context }) => {
		if (context.user) {
			throw redirect({ to: "/" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const handleSignIn = async () => {
		try {
			await signIn.email({
				email: "demo@example.com",
				password: "password1234",
				callbackURL: "/",
			});
		} catch (error) {
			console.error(`Failed to sign in:`, error);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<Button onClick={handleSignIn}>Sign in as demo user</Button>
		</div>
	);
}
