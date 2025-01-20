import Link from "next/link";
import { JoinButton } from "~/app/_components/join-button";
import { Button } from "~/components/ui/button";
import { getAvailableHunts, getMyParticipations } from "~/server/api";

export default async function HomePage() {
	const [myParticipations, availableHunts] = await Promise.all([
		getMyParticipations(),
		getAvailableHunts(),
	]);

	return (
		<div className="flex flex-col justify-center gap-4">
			{!!myParticipations.length && (
				<>
					<h2 className="font-semibold text-lg">My Active Hunts</h2>
					<ul className="flex flex-col gap-4">
						{myParticipations.map((participation) => (
							<li key={participation.huntId}>
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

			<div className="-mx-1 my-1 h-px bg-muted" />

			<h2 className="font-semibold text-lg">Available Hunts</h2>
			<ul className="flex flex-col gap-4">
				{availableHunts.map((hunt) => (
					<li key={hunt.id} className="flex items-center justify-between gap-4">
						<p>{hunt.createdBy.name}'s Hunt</p>
						<JoinButton huntId={hunt.id} />
					</li>
				))}
			</ul>

			<div className="-mx-1 my-1 h-px bg-muted" />

			<Button variant="secondary" asChild>
				<Link href="/hunts/create">Create a New Hunt</Link>
			</Button>
		</div>
	);
}
