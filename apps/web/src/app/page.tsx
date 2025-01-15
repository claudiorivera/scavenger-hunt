import Link from "next/link";
import { JoinButton } from "~/app/_components/join-button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { getSessionOrThrow } from "~/lib/auth-utils";
import { getInitials } from "~/lib/get-initials";
import { getAvailableHunts, getMyParticipations } from "~/server/api";

export default async function HomePage() {
	const session = await getSessionOrThrow();

	const myParticipations = await getMyParticipations();
	const availableHunts = await getAvailableHunts();

	return (
		<div className="flex flex-col items-center gap-4">
			<Avatar className="h-24 w-24">
				<AvatarImage src={session.user.image ?? undefined} alt="User Avatar" />
				<AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
			</Avatar>

			<header className="font-semibold text-2xl leading-snug">
				{session.user?.name ?? "Anonymous User"}
			</header>

			<div>
				<h2>My Active Hunts</h2>
				<ul className="flex w-full flex-col gap-4">
					{myParticipations.map((participation) => (
						<li key={participation.id}>
							<Button variant="secondary" asChild>
								<Link href={`/hunts/${participation.huntId}`}>
									{participation.hunt.createdBy.name}'s Hunt
								</Link>
							</Button>
						</li>
					))}
				</ul>
			</div>

			{!!availableHunts.length && (
				<div>
					<h2>Available Hunts</h2>
					<ul className="flex w-full flex-col gap-4">
						{availableHunts.map((hunt) => (
							<li key={hunt.id} className="flex items-center gap-4">
								<p>{hunt.createdBy.name}'s Hunt</p>
								<JoinButton huntId={hunt.id} />
							</li>
						))}
					</ul>
				</div>
			)}

			<div>
				<Button variant="secondary" asChild>
					<Link href="/hunts/create">Create a New Hunt</Link>
				</Button>
			</div>
		</div>
	);
}
