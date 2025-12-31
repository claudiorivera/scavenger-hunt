import { queryOptions } from "@tanstack/react-query";
import {
	getUsersByHuntIdServerFn,
	getUsersWhoCollectedItemServerFn,
	getUserWithCollectionItemsForHuntServerFn,
} from "@/server-funcs/user";

export const userQueries = {
	base: () => ["user"],
	list: () => [...userQueries.base(), userQueries.list.name],
	byItemIdInCollection: (itemId: string) =>
		queryOptions({
			queryKey: [
				...userQueries.list(),
				userQueries.byItemIdInCollection.name,
				itemId,
			],
			queryFn: () =>
				getUsersWhoCollectedItemServerFn({
					data: {
						itemId,
					},
				}),
		}),
	byIdAndHuntWithCollectionItems: (userId: string, huntId: string) =>
		queryOptions({
			queryKey: [
				...userQueries.base(),
				userQueries.byIdAndHuntWithCollectionItems.name,
				userId,
				huntId,
			],
			queryFn: () =>
				getUserWithCollectionItemsForHuntServerFn({
					data: {
						userId,
						huntId,
					},
				}),
		}),
	byHuntId: (huntId: string) =>
		queryOptions({
			queryKey: [...userQueries.list(), userQueries.byHuntId.name, huntId],
			queryFn: () =>
				getUsersByHuntIdServerFn({
					data: {
						huntId,
					},
				}),
		}),
};
