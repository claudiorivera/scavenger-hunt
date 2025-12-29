import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { EyeIcon } from "lucide-react";
import { LoadingButton } from "@/components/loading-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { can } from "@/lib/permissions";
import { getInitials } from "@/lib/utils";
import { itemQueries } from "@/queries/item";
import { userQueries } from "@/queries/user";
import { useDeleteItem } from "@/routes/hunts/$huntId/items/$itemId/-hooks/use-delete-item";
import type { UserWithCollectionItems } from "@/server-funcs/user";

export const Route = createFileRoute("/hunts/$huntId/items/$itemId/")({
	beforeLoad: async ({ context }) => {
		if (!context.user) {
			throw redirect({ to: "/sign-in" });
		}

		return {
			user: context.user,
		};
	},
	loader: async ({ context, params }) => {
		const [item, users] = await Promise.all([
			context.queryClient.ensureQueryData(itemQueries.byId(params.itemId)),
			context.queryClient.ensureQueryData(
				userQueries.byItemIdInCollection(params.itemId),
			),
		]);

		return { item, users };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = Route.useRouteContext();
	const { item, users } = Route.useLoaderData();
	const { huntId } = Route.useParams();

	const { mutate: deleteItem, isPending } = useDeleteItem();

	const navigate = useNavigate();

	const hasCurrentUserCollected = users.some((u) => u.id === user.id);

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">{item.description}</header>
			<div className="text-2xl">Collected By:</div>

			{users.length ? (
				<UsersList users={users} itemId={item.id} huntId={huntId} />
			) : (
				<div className="text-2xl">Nobody, yet 😢</div>
			)}

			{!hasCurrentUserCollected && (
				<Button variant="secondary" asChild>
					<Link
						to="/hunts/$huntId/items/$itemId/collect"
						params={{ huntId, itemId: item.id }}
					>
						Collect this item
					</Link>
				</Button>
			)}

			{can(user).deleteItem(item) && (
				<LoadingButton
					isLoading={isPending}
					onClick={() =>
						deleteItem(
							{ data: { itemId: item.id } },
							{
								onSuccess: () =>
									navigate({ to: "/hunts/$huntId/items", params: { huntId } }),
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

function UsersList({
	users,
	itemId,
	huntId,
}: {
	users: Array<UserWithCollectionItems>;
	itemId: string;
	huntId: string;
}) {
	return (
		<ul className="flex flex-col gap-4 pb-4">
			{users.map((user) => {
				const collectionItem = user.collectionItems.find(
					(ci) => ci.itemId === itemId,
				);

				return (
					<li key={user.id} className="flex items-center gap-4">
						<Link
							to="/hunts/$huntId/users/$userId"
							params={{
								huntId,
								userId: user.id,
							}}
						>
							<Avatar>
								<AvatarImage src={user.image ?? undefined} />
								<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
							</Avatar>
						</Link>
						<div className="flex-1 text-left">{user.name}</div>
						{!!collectionItem?.id && (
							<Button variant="secondary" asChild>
								<Link
									to="/hunts/$huntId/collection-items/$collectionItemId"
									params={{
										huntId,
										collectionItemId: collectionItem.id,
									}}
								>
									<EyeIcon />
								</Link>
							</Button>
						)}
					</li>
				);
			})}
		</ul>
	);
}
