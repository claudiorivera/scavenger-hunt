import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Scripts,
	useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { LogOutIcon, ShieldUserIcon, UserRoundIcon } from "lucide-react";
import { useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { TanStackQueryDevtools } from "@/integrations/tanstack-query/devtools";
import { signOut } from "@/lib/auth-client";
import { can } from "@/lib/permissions";
import { getInitials } from "@/lib/utils";
import { authQueries } from "@/queries/auth";
import appCss from "@/styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, maximum-scale=1",
			},
			{
				title: "Scavenger Hunt",
			},
			{
				description: "A photo scavenger hunt to play with your friends",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
			{ rel: "icon", href: "/favicon.ico" },
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
		],
	}),
	shellComponent: RootDocument,
	notFoundComponent: () => <div>Not found</div>,
	beforeLoad: async ({ context }) => {
		const { user } = await context.queryClient.ensureQueryData(
			authQueries.me(),
		);

		return { user };
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { user, queryClient } = Route.useRouteContext();

	const navigate = useNavigate();

	const handleSignOut = useCallback(
		() =>
			signOut({
				fetchOptions: {
					onSuccess: () => {
						queryClient.resetQueries({
							queryKey: authQueries.me().queryKey,
						});

						navigate({ to: "/sign-in" });
					},
				},
			}),
		[navigate, queryClient],
	);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>

			<body>
				<Toaster />

				<div className="flex bg-primary p-4 text-primary-foreground">
					<div className="flex-1">
						<Link to="/" className="font-bold text-2xl">
							Scavenger Hunt
						</Link>
					</div>

					{!!user && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Avatar className="cursor-pointer outline-1 outline-white">
									<AvatarImage
										src={user.image ?? undefined}
										alt={`${user.name}'s profile picture`}
									/>
									<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="p-2" align="end">
								<DropdownMenuItem asChild>
									<Link to="/profile" className="cursor-pointer">
										<UserRoundIcon />
										<span>My Profile</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={handleSignOut}
								>
									<LogOutIcon />
									<span>Sign Out</span>
								</DropdownMenuItem>

								{can(user).viewAdminPanel() && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<Link to="/admin" className="cursor-pointer">
												<ShieldUserIcon />
												<span>Admin</span>
											</Link>
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>

				<main className="container mx-auto max-w-md p-8 text-center">
					{children}
				</main>

				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
