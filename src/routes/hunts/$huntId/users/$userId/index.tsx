import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getInitials } from "@/lib/utils";
import { userQueries } from "@/queries/user";

export const Route = createFileRoute("/hunts/$huntId/users/$userId/")({
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
		context.queryClient.ensureQueryData(
			userQueries.byIdAndHuntWithCollectionItems(params.userId, params.huntId),
		),
});

function RouteComponent() {
	const { huntId, userId } = Route.useParams();
	const { data: user } = useSuspenseQuery(
		userQueries.byIdAndHuntWithCollectionItems(userId, huntId),
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<Avatar className="h-24 w-24">
					<AvatarImage src={user.image ?? undefined} />
					<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
				</Avatar>

				<header className="text-5xl">{user.name}</header>

				<div className="text-2xl">Found the Following Items:</div>
			</div>

			<ul className="flex flex-wrap justify-center gap-2">
				{user.collectionItems.map((collectionItem) => (
					<Link
						key={collectionItem.id}
						to="/hunts/$huntId/collection-items/$collectionItemId"
						params={{
							huntId,
							collectionItemId: collectionItem.id,
						}}
					>
						<Tooltip>
							<TooltipTrigger asChild>
								<Avatar>
									<AvatarFallback>
										<Skeleton className="h-10 w-10" />
									</AvatarFallback>
									<AvatarImage src={collectionItem.url} />
								</Avatar>
							</TooltipTrigger>
							<TooltipContent className="bg-black">
								{collectionItem.item.description}
							</TooltipContent>
						</Tooltip>
					</Link>
				))}
			</ul>
		</div>
	);
}
