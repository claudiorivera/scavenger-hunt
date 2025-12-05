import Link from "next/link";
import { DeleteHunt } from "@/app/hunts/[huntId]/_components/delete-hunt";
import { LeaveHunt } from "@/app/hunts/[huntId]/_components/leave-hunt";
import { SignInButton } from "@/components/sign-in-button";
import { Button } from "@/components/ui/button";
import { can } from "@/lib/permissions";
import { getHuntOrThrow, getSessionUser } from "@/server/api";

export default async function HuntPage({
	params,
}: {
	params: Promise<{ huntId: string }>;
}) {
	const { huntId } = await params;

	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		return <SignInButton />;
	}

	const hunt = await getHuntOrThrow(huntId);

	const menuItems = [
		{ href: `/hunts/${huntId}/collect`, label: "Collect Items" },
		{ href: `/hunts/${huntId}/leaderboard`, label: "Leaderboard" },
		{ href: `/hunts/${huntId}/items`, label: "View Items" },
	];

	return (
		<div className="flex flex-col gap-4">
			<p className="font-semibold text-lg">{hunt.createdBy.name}'s Hunt</p>

			<ul className="flex flex-col gap-2">
				{menuItems.map((item) => (
					<li key={item.href}>
						<Button asChild className="w-full" variant="secondary">
							<Link href={item.href}>{item.label}</Link>
						</Button>
					</li>
				))}
			</ul>

			<LeaveHunt id={huntId} />

			{can(sessionUser).deleteHunt(hunt) && <DeleteHunt id={huntId} />}
		</div>
	);
}
