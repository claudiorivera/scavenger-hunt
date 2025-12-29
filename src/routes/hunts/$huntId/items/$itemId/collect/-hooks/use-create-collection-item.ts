import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import type { Item } from "@/db/types";
import { itemQueries } from "@/queries/item";
import { createCollectionItemServerFn } from "@/server-funcs/collection-item";

const routeApi = getRouteApi("/hunts/$huntId/items/$itemId/collect/");

export function useCreateCollectionItem() {
	const { huntId } = routeApi.useParams();

	const createCollectionItemWithUpload = useServerFn(
		createCollectionItemServerFn,
	);

	return useMutation({
		mutationFn: async ({
			base64,
			itemId,
		}: {
			base64: string;
			itemId: Item["id"];
		}) =>
			createCollectionItemWithUpload({
				data: {
					base64,
					itemId,
					huntId,
				},
			}),
		onSettled: (_data, _error, _variables, _onMutateResult, context) =>
			context.client.invalidateQueries({
				queryKey: itemQueries.nextUncollectedByHunt(huntId).queryKey,
			}),
	});
}
