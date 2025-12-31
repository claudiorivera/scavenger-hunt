import { useSuspenseQueries } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { huntQueries } from "@/queries/hunt";
import { participationQueries } from "@/queries/participation";
import { useJoinHunt } from "@/routes/-hooks/use-join-hunt";

export const Route = createFileRoute("/")({
	component: App,
	beforeLoad: async ({ context }) => {
		if (!context.user) {
			throw redirect({ to: "/sign-in" });
		}

		return {
			user: context.user,
		};
	},
	loader: ({ context }) =>
		Promise.all([
			context.queryClient.ensureQueryData(participationQueries.mine()),
			context.queryClient.ensureQueryData(huntQueries.available()),
		]),
});

function App() {
	const [{ data: myParticipations }, { data: availableHunts }] =
		useSuspenseQueries({
			queries: [participationQueries.mine(), huntQueries.available()],
		});

	const {
		mutate: joinHunt,
		isPending: isPendingJoin,
		variables,
	} = useJoinHunt();

	const navigate = useNavigate();

	return (
		<div className="flex flex-col justify-center gap-4">
			{!!myParticipations.length && (
				<>
					<h2 className="font-semibold text-lg">My Active Hunts</h2>
					<ul className="flex flex-col gap-4">
						{myParticipations.map((participation) => (
							<li key={participation.huntId}>
								<Button variant="secondary" asChild className="w-full">
									<Link
										to="/hunts/$huntId"
										params={{ huntId: participation.huntId }}
									>
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
						<LoadingButton
							isLoading={isPendingJoin && variables.data.huntId === hunt.id}
							variant="secondary"
							onClick={() =>
								joinHunt(
									{
										data: {
											huntId: hunt.id,
										},
									},
									{
										onSuccess: ({ huntId }) =>
											navigate({
												to: "/hunts/$huntId",
												params: { huntId },
											}),
									},
								)
							}
						>
							Join
						</LoadingButton>
					</li>
				))}
			</ul>

			<div className="-mx-1 my-1 h-px bg-muted" />

			<Button variant="secondary" asChild>
				<Link to="/hunts/create">Create a New Hunt</Link>
			</Button>
		</div>
	);
}
