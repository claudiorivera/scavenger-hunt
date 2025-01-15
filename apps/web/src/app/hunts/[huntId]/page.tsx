import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { getSessionOrThrow } from "~/lib/auth-utils";
import { getInitials } from "~/lib/get-initials";

export default async function HuntPage({
	params,
}: {
	params: Promise<{ huntId: string }>;
}) {
	const session = await getSessionOrThrow();
	const { huntId } = await params;

	const menuItems = [
		{ href: `/hunts/${huntId}/collect`, label: "Collect Items" },
		{ href: `/hunts/${huntId}/leaderboard`, label: "Leaderboard" },
		{ href: `/hunts/${huntId}/items`, label: "View Items" },
	];

	return (
		<div className="flex flex-col items-center gap-4">
			<Avatar className="h-24 w-24">
				<AvatarImage src={session.user.image ?? undefined} alt="User Avatar" />
				<AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
			</Avatar>

			<header className="font-semibold text-2xl leading-snug">
				{session.user?.name ?? "Anonymous User"}
			</header>

			<ul className="flex w-full flex-col gap-2">
				{menuItems.map((item) => (
					<li key={item.href}>
						<Button asChild variant="secondary">
							<Link href={item.href}>{item.label}</Link>
						</Button>
					</li>
				))}
			</ul>
		</div>
	);
}
