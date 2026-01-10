import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTransition } from "react";
import { LoadingButton } from "@/components/loading-button";
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
	const [isPending, startTransition] = useTransition();

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
			<LoadingButton
				isLoading={isPending}
				onClick={() => startTransition(handleSignIn)}
			>
				Sign in as demo user
			</LoadingButton>
		</div>
	);
}
