import { useSuspenseQueries } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { can } from "@/lib/permissions";
import { collectionItemQueries } from "@/queries/collection-item";
import { userQueries } from "@/queries/user";
import { useDeleteCollectionItem } from "@/routes/hunts/$huntId/collection-items/$collectionItemId/-hooks/use-delete-collection-item";

export const Route = createFileRoute(
	"/hunts/$huntId/collection-items/$collectionItemId/",
)({
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
			context.queryClient.ensureQueryData(
				collectionItemQueries.byIdWithUserAndItem(params.collectionItemId),
			),
			context.queryClient.ensureQueryData(
				userQueries.byIdAndHuntWithCollectionItems(
					context.user.id,
					params.huntId,
				),
			),
		]),
});

function RouteComponent() {
	const { huntId, collectionItemId } = Route.useParams();
	const { user: contextUser } = Route.useRouteContext();

	const [{ data: collectionItem }, { data: user }] = useSuspenseQueries({
		queries: [
			collectionItemQueries.byIdWithUserAndItem(collectionItemId),
			userQueries.byIdAndHuntWithCollectionItems(contextUser.id, huntId),
		],
	});

	const title = `${collectionItem.user.name} has found ${collectionItem.item.description}!`;
	const hasCurrentUserCollected = user.collectionItems.some(
		(item) => item.itemId === collectionItem.item.id,
	);
	const isCurrentUserOwner = collectionItem.user.id === user.id;

	const { mutate: deleteCollectionItem, isPending: isPendingDelete } =
		useDeleteCollectionItem();

	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-4">
			<header className="text-2xl">{title}</header>

			<img
				src={collectionItem.url}
				width={collectionItem.width}
				height={collectionItem.height}
				alt={title}
				className="aspect-square h-full w-full max-w-sm bg-black object-contain"
			/>

			{!hasCurrentUserCollected && (
				<Button variant="secondary" asChild>
					<Link
						to="/hunts/$huntId/items/$itemId/collect"
						params={{ huntId, itemId: collectionItem.itemId }}
					>
						Collect this item
					</Link>
				</Button>
			)}

			{isCurrentUserOwner && (
				<Button variant="secondary" asChild>
					<Link to="/hunts/$huntId/collect" params={{ huntId }}>
						Find More Stuff!
					</Link>
				</Button>
			)}

			<Button variant="secondary" asChild>
				<Link
					to="/hunts/$huntId/items/$itemId"
					params={{
						huntId,
						itemId: collectionItem.item.id,
					}}
				>
					See who found this
				</Link>
			</Button>

			{can(user).deleteCollectionItem(collectionItem) && (
				<LoadingButton
					isLoading={isPendingDelete}
					onClick={() =>
						deleteCollectionItem(
							{
								data: {
									id: collectionItemId,
								},
							},
							{
								onSuccess: (_data, _variables, _onMutateResult, context) => {
									context.client.invalidateQueries({
										queryKey: userQueries.byHuntId(huntId).queryKey,
									});

									navigate({
										to: "/hunts/$huntId/leaderboard",
										params: { huntId },
									});
								},
							},
						)
					}
				>
					Delete this item
				</LoadingButton>
			)}
		</div>
	);
}
