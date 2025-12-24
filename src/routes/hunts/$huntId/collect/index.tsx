import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { itemQueries } from "@/queries/item";

export const Route = createFileRoute("/hunts/$huntId/collect/")({
	component: RouteComponent,
	beforeLoad: async ({ context, params }) => {
		if (!context.user) {
			throw redirect({
				to: "/sign-in",
			});
		}

		const data = await context.queryClient.fetchQuery(
			itemQueries.nextUncollectedByHunt(params.huntId),
		);

		if (data?.id) {
			throw redirect({
				to: "/hunts/$huntId/items/$itemId/collect",
				params: {
					huntId: params.huntId,
					itemId: data.id,
				},
			});
		}

		return {
			user: context.user,
		};
	},
});

function RouteComponent() {
	const { huntId } = Route.useParams();
	const { user } = Route.useRouteContext();

	return (
		<div className="flex flex-col gap-4">
			<h3>
				You Found All The Items!&nbsp;
				<span role="img" aria-label="celebrate emoji">
					🎉
				</span>
			</h3>

			<Button variant="secondary" asChild>
				<Link
					to="/hunts/$huntId/users/$userId"
					params={{
						huntId,
						userId: user.id,
					}}
				>
					See your collection
				</Link>
			</Button>
		</div>
	);
}
