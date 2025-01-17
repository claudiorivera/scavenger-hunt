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
		<div className="flex flex-col justify-center gap-4">
			<div className="flex justify-center">
				<Avatar className="h-24 w-24">
					<AvatarImage
						src={session.user.image ?? undefined}
						alt="User Avatar"
					/>
					<AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
				</Avatar>
			</div>

			<header className="font-semibold text-2xl leading-snug">
				{session.user?.name ?? "Anonymous User"}
			</header>

			{!!myParticipations.length && (
				<>
					<h2 className="font-semibold text-lg">My Active Hunts</h2>
					<ul className="flex flex-col gap-4">
						{myParticipations.map((participation) => (
							<li key={participation.id}>
								<Button variant="secondary" asChild className="w-full">
									<Link href={`/hunts/${participation.huntId}`}>
										{participation.hunt.createdBy.name}'s Hunt
									</Link>
								</Button>
							</li>
						))}
					</ul>
				</>
			)}

			{!!availableHunts.length && (
				<>
					<h2 className="font-semibold text-lg">Available Hunts</h2>
					<ul className="flex flex-col gap-4">
						{availableHunts.map((hunt) => (
							<li
								key={hunt.id}
								className="flex items-center justify-between gap-4"
							>
								<p>{hunt.createdBy.name}'s Hunt</p>
								<JoinButton huntId={hunt.id} />
							</li>
						))}
					</ul>
				</>
			)}

			<div className="-mx-1 my-1 h-px bg-muted" />

			<Button variant="secondary" asChild>
				<Link href="/hunts/create">Create a New Hunt</Link>
			</Button>
		</div>
	);
}
