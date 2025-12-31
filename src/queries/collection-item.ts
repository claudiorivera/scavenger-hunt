import { queryOptions } from "@tanstack/react-query";
import { getCollectionItemWithUserAndItemByIdServerFn } from "@/server-funcs/collection-item";

export const collectionItemQueries = {
	base: () => ["collection-item"],
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
