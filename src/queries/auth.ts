import { queryOptions } from "@tanstack/react-query";
import { getUserSession } from "@/server-funcs/auth";

export const authQueries = {
	base: () => ["auth"],
	me: () =>
		queryOptions({
			queryKey: [...authQueries.base(), authQueries.me.name],
			queryFn: getUserSession,
		}),
};
