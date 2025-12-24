import { queryOptions } from "@tanstack/react-query";
import { getCollectionItemWithUserAndItemByIdServerFn } from "@/server-funcs/collection-items";

export const collectionItemQueries = {
	base: () => ["collectionItem"],
	byIdWithUserAndItem: (id: string) =>
		queryOptions({
			queryKey: [
				...collectionItemQueries.base(),
				collectionItemQueries.byIdWithUserAndItem.name,
				id,
			],
			queryFn: () =>
				getCollectionItemWithUserAndItemByIdServerFn({ data: { id } }),
		}),
};
