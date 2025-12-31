import { queryOptions } from "@tanstack/react-query";
import { getMyParticipationsServerFn } from "@/server-funcs/participation";

export const participationQueries = {
	base: () => ["participation"],
	list: () => [...participationQueries.base(), participationQueries.list.name],
	mine: () =>
		queryOptions({
			queryKey: [
				...participationQueries.list(),
				participationQueries.mine.name,
			],
			queryFn: getMyParticipationsServerFn,
		}),
};
