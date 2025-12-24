import { createId } from "@paralleldrive/cuid2";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { itemQueries } from "@/queries/item";
import { createItemServerFn } from "@/server-funcs/items";

const routeApi = getRouteApi("/hunts/$huntId/items/");

export function useAddItem() {
	const { huntId } = routeApi.useParams();

	const createItem = useServerFn(createItemServerFn);

	return useMutation({
		mutationFn: ({ description }: { description: string }) =>
			createItem({
				data: {
					description,
					huntId,
				},
			}),
		onMutate: async ({ description }, context) => {
			await context.client.cancelQueries({
				queryKey: itemQueries.byHuntIdGroupByStatus(huntId).queryKey,
			});

			const previousItems = context.client.getQueryData(
				itemQueries.byHuntIdGroupByStatus(huntId).queryKey,
			);

			context.client.setQueryData(
				itemQueries.byHuntIdGroupByStatus(huntId).queryKey,
				(prev) => {
					if (!prev) return prev;

					return [
						{
							item: {
								description,
								huntId,
								createdAt: new Date(),
								updatedAt: new Date(),
								createdById: createId(),
								id: createId(),
							},
							collectedAt: new Date(),
						},
						...prev,
					];
				},
			);

			return { previousItems };
		},
		onError: (_err, _variables, onMutateResult, context) => {
			context.client.setQueryData(
				itemQueries.byHuntIdGroupByStatus(huntId).queryKey,
				onMutateResult?.previousItems,
			);
		},
		onSettled: (_data, _error, _variables, _onMutateResult, context) =>
			context.client.invalidateQueries({
				queryKey: itemQueries.byHuntIdGroupByStatus(huntId).queryKey,
			}),
	});
}
