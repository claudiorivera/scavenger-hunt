import { queryOptions } from "@tanstack/react-query";
import {
	getAvailableHuntsServerFn,
	getHuntByIdServerFn,
} from "@/server-funcs/hunt";

export const huntQueries = {
	base: () => ["hunt"],
	available: () =>
		queryOptions({
			queryKey: [...huntQueries.base(), huntQueries.available.name],
			queryFn: getAvailableHuntsServerFn,
		}),
	byId: (id: string) =>
		queryOptions({
			queryKey: [...huntQueries.base(), huntQueries.byId.name, id],
			queryFn: () => getHuntByIdServerFn({ data: { id } }),
		}),
};
