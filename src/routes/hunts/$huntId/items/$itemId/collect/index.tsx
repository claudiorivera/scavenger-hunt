import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { itemQueries } from "@/queries/item";
import { CollectionItemForm } from "@/routes/hunts/$huntId/items/$itemId/collect/-components/collection-item-form";

export const Route = createFileRoute("/hunts/$huntId/items/$itemId/collect/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.user) {
			throw redirect({
				to: "/sign-in",
			});
		}

		return {
			user: context.user,
		};
	},
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(itemQueries.byId(params.itemId)),
});

function RouteComponent() {
	const { itemId } = Route.useParams();
	const { data: item } = useSuspenseQuery(itemQueries.byId(itemId));
	const { huntId } = Route.useParams();

	return (
		<div className="flex flex-col gap-4 text-center">
			<header className="text-2xl">Find</header>
			<div className="text-3xl">{item.description}</div>

			<CollectionItemForm item={item} />

			<Button variant="secondary" asChild>
				<Link
					to="/hunts/$huntId/items/$itemId"
					params={{
						huntId,
						itemId: item.id,
					}}
				>
					See who found this
				</Link>
			</Button>
		</div>
	);
}
