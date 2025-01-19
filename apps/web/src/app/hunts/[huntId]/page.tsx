import Link from "next/link";
import { LeaveHunt } from "~/app/hunts/[huntId]/_components/leave-hunt";
import { Button } from "~/components/ui/button";

export default async function HuntPage({
	params,
}: {
	params: Promise<{ huntId: string }>;
}) {
	const { huntId } = await params;

	const menuItems = [
		{ href: `/hunts/${huntId}/collect`, label: "Collect Items" },
		{ href: `/hunts/${huntId}/leaderboard`, label: "Leaderboard" },
		{ href: `/hunts/${huntId}/items`, label: "View Items" },
	];

	return (
		<div className="flex flex-col gap-4">
			<ul className="flex flex-col gap-2">
				{menuItems.map((item) => (
					<li key={item.href}>
						<Button asChild className="w-full" variant="secondary">
							<Link href={item.href}>{item.label}</Link>
						</Button>
					</li>
				))}
			</ul>

			<LeaveHunt huntId={huntId} />
		</div>
	);
}
