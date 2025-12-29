import { queryOptions } from "@tanstack/react-query";
import { getMyParticipationsServerFn } from "@/server-funcs/participation";

export const participationQueries = {
	base: () => ["participation"],
	mine: () =>
		queryOptions({
			queryKey: [
				...participationQueries.base(),
				participationQueries.mine.name,
			],
			queryFn: getMyParticipationsServerFn,
		}),
};
