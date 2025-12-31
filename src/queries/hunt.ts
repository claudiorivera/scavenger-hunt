import { queryOptions } from "@tanstack/react-query";
import {
	getAvailableHuntsServerFn,
	getHuntByIdServerFn,
} from "@/server-funcs/hunt";

export const huntQueries = {
	base: () => ["hunt"],
	list: () => [...huntQueries.base(), huntQueries.list.name],
	available: () =>
		queryOptions({
			queryKey: [...huntQueries.list(), huntQueries.available.name],
			queryFn: getAvailableHuntsServerFn,
		}),
	byId: (id: string) =>
		queryOptions({
			queryKey: [...huntQueries.base(), huntQueries.byId.name, id],
			queryFn: () => getHuntByIdServerFn({ data: { id } }),
		}),
};
