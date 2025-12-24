import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { can } from "@/lib/permissions";
import { huntQueries } from "@/queries/hunt";
import { itemQueries } from "@/queries/item";
import { AddItemForm } from "@/routes/hunts/$huntId/items/-components/add-item-form";
import { ItemLink } from "@/routes/hunts/$huntId/items/-components/item-link";

export const Route = createFileRoute("/hunts/$huntId/items/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.user) {
			throw redirect({ to: "/sign-in" });
		}

		return {
			user: context.user,
		};
	},
	loader: ({ context, params }) =>
		Promise.all([
			context.queryClient.ensureQueryData(
				itemQueries.byHuntIdGroupByStatus(params.huntId),
			),
			context.queryClient.ensureQueryData(huntQueries.byId(params.huntId)),
		]),
});

function RouteComponent() {
	const { huntId } = Route.useParams();
	const { user } = Route.useRouteContext();

	const [{ data: items }, { data: hunt }] = useSuspenseQueries({
		queries: [
			itemQueries.byHuntIdGroupByStatus(huntId),
			huntQueries.byId(huntId),
		],
	});

	const totalItems = items.collected.length + items.uncollected.length;

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">All Items</header>

			<div>
				Found {items.collected.length} out of {totalItems} items! 📷
			</div>

			<ul className="flex flex-col gap-4">
				{[...items.uncollected].map((item) => (
					<ItemLink key={item.id} item={item} huntId={huntId} />
				))}
				{[...items.collected].map((item) => (
					<ItemLink key={item.id} item={item} huntId={huntId} isCollected />
				))}
			</ul>

			{can(user).addItemToHunt(hunt) && <AddItemForm />}
		</div>
	);
}
