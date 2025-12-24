import { queryOptions } from "@tanstack/react-query";
import type { Item } from "@/db/types";
import {
	getItemByIdServerFn,
	getItemsByHuntIdServerFn,
	getNextUncollectedItemForHuntServerFn,
} from "@/server-funcs/items";

export const itemQueries = {
	base: () => ["item"],
	byHuntIdGroupByStatus: (huntId: string) =>
		queryOptions({
			queryKey: [
				...itemQueries.base(),
				itemQueries.byHuntIdGroupByStatus.name,
				huntId,
			],
			queryFn: () =>
				getItemsByHuntIdServerFn({
					data: {
						huntId,
					},
				}),
			select: (rows) => {
				const groupedByStatus: Record<
					"collected" | "uncollected",
					Array<Item>
				> = {
					collected: [],
					uncollected: [],
				};

				for (const row of rows) {
					if (row.collectedAt) {
						groupedByStatus.collected.push(row.item);
					} else {
						groupedByStatus.uncollected.push(row.item);
					}
				}

				return groupedByStatus;
			},
		}),
	byId: (itemId: string) =>
		queryOptions({
			queryKey: [...itemQueries.base(), itemQueries.byId.name, itemId],
			queryFn: () =>
				getItemByIdServerFn({
					data: { itemId },
				}),
		}),
	nextUncollectedByHunt: (huntId: string) =>
		queryOptions({
			queryKey: [
				...itemQueries.base(),
				itemQueries.nextUncollectedByHunt.name,
				huntId,
			],
			queryFn: async () => {
				const item = await getNextUncollectedItemForHuntServerFn({
					data: {
						huntId,
					},
				});

				if (!item) return null;

				return item;
			},
		}),
};
