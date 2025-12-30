import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { can } from "@/lib/permissions";
import { huntQueries } from "@/queries/hunt";
import { useDeleteHunt } from "@/routes/hunts/$huntId/-hooks/use-delete-hunt";
import { useLeaveHunt } from "@/routes/hunts/$huntId/-hooks/use-leave-hunt";

export const Route = createFileRoute("/hunts/$huntId/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.user) {
			throw redirect({ to: "/sign-in" });
		}

		return {
			user: context.user,
		};
	},
	loader: async ({ context, params }) =>
		context.queryClient.ensureQueryData(huntQueries.byId(params.huntId)),
});

function RouteComponent() {
	const { huntId } = Route.useParams();
	const { data: hunt } = useSuspenseQuery(huntQueries.byId(huntId));
	const { user } = Route.useRouteContext();

	const { mutate: leaveHunt, isPending: isPendingLeave } = useLeaveHunt();
	const { mutate: deleteHunt, isPending: isPendingDelete } = useDeleteHunt();

	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-4">
			<p className="font-semibold text-lg">{hunt.createdBy.name}'s Hunt</p>

			<ul className="flex flex-col gap-2 **:w-full">
				<li>
					<Button asChild variant="secondary">
						<Link to="/hunts/$huntId/collect" params={{ huntId }}>
							Collect Items
						</Link>
					</Button>
				</li>
				<li>
					<Button asChild variant="secondary">
						<Link to="/hunts/$huntId/leaderboard" params={{ huntId }}>
							Leaderboard
						</Link>
					</Button>
				</li>
				<li>
					<Button asChild variant="secondary">
						<Link to="/hunts/$huntId/items" params={{ huntId }}>
							View Items
						</Link>
					</Button>
				</li>
				<li>
					<Button variant="secondary" asChild>
						<Link
							to="/hunts/$huntId/users/$userId"
							params={{
								huntId,
								userId: user.id,
							}}
						>
							My Collection
						</Link>
					</Button>
				</li>
			</ul>

			<LoadingButton
				isLoading={isPendingLeave}
				variant="secondary"
				onClick={() => {
					leaveHunt(
						{
							data: {
								huntId: hunt.id,
							},
						},
						{
							onSuccess: () => navigate({ to: "/" }),
						},
					);
				}}
			>
				Leave
			</LoadingButton>

			{can(user).deleteHunt(hunt) && (
				<LoadingButton
					isLoading={isPendingDelete}
					variant="destructive"
					onClick={() => {
						deleteHunt(
							{
								data: {
									huntId: hunt.id,
								},
							},
							{
								onSuccess: () => navigate({ to: "/" }),
							},
						);
					}}
				>
					Delete hunt
				</LoadingButton>
			)}
		</div>
	);
}
