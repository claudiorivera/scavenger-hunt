import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { TrashIcon } from "lucide-react";
import { LoadingButton } from "@/components/loading-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { can } from "@/lib/permissions";
import { getInitials } from "@/lib/utils";
import { huntQueries } from "@/queries/hunt";
import { userQueries } from "@/queries/user";
import { useDeleteUser } from "@/routes/hunts/$huntId/leaderboard/-hooks/use-delete-user";

export const Route = createFileRoute("/hunts/$huntId/leaderboard/")({
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
		Promise.all([
			context.queryClient.ensureQueryData(userQueries.byHuntId(params.huntId)),
			context.queryClient.ensureQueryData(huntQueries.byId(params.huntId)),
		]),
});

function RouteComponent() {
	const { huntId } = Route.useParams();
	const [{ data: users }, { data: hunt }] = useSuspenseQueries({
		queries: [userQueries.byHuntId(huntId), huntQueries.byId(huntId)],
	});
	const { user: sessionUser } = Route.useRouteContext();

	const { mutate: deleteUser, isPending } = useDeleteUser();

	return (
		<div className="flex flex-col items-center gap-4">
			<header className="text-5xl">Leaderboard</header>
			<ul className="flex flex-col gap-4">
				{users.map((user) => (
					<li key={user.id} className="flex items-center gap-4">
						{hunt.createdById !== user.id &&
							can(sessionUser).deleteUser(user) && (
								<LoadingButton
									isLoading={isPending}
									onClick={() =>
										deleteUser(
											{
												data: {
													userId: user.id,
												},
											},
											{
												onSettled: (
													_data,
													_error,
													_variables,
													_onMutateResult,
													context,
												) =>
													context.client.invalidateQueries({
														queryKey: userQueries.byHuntId(huntId).queryKey,
													}),
											},
										)
									}
								>
									<TrashIcon />
								</LoadingButton>
							)}
						<Link
							to="/hunts/$huntId/users/$userId"
							params={{
								huntId,
								userId: user.id,
							}}
							className="flex w-full items-center gap-4"
						>
							<Avatar>
								<AvatarImage src={user.image ?? undefined} />
								<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
							</Avatar>
							<div className="flex-1 text-left">{user.name}</div>
							<div className="ml-auto">{user.collectionItems} items</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
