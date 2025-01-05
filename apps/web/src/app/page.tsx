import { auth } from "@claudiorivera/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { getInitials } from "~/lib/get-initials";

const menuItems = [
	{ href: "/collect", label: "Collect Items" },
	{ href: "/leaderboard", label: "Leaderboard" },
	{ href: "/items", label: "View Items" },
	{ href: "/profile", label: "My Profile" },
];

export default async function HomePage() {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	return (
		<div className="flex flex-col items-center gap-4">
			<Avatar className="h-24 w-24">
				<AvatarImage src={session.user.image ?? undefined} alt="User Avatar" />
				<AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
			</Avatar>

			<header className="font-semibold text-2xl leading-snug">
				{session.user?.name ?? "Anonymous User"}
			</header>

			<div className="flex w-full flex-col gap-2">
				{menuItems.map(({ href, label }) => (
					<Button key={href} asChild variant="secondary">
						<Link href={href}>{label}</Link>
					</Button>
				))}
			</div>
		</div>
	);
}
