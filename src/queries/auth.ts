import { queryOptions } from "@tanstack/react-query";
import { getUserSessionServerFn } from "@/server-funcs/auth";

export const authQueries = {
	base: () => ["auth"],
	me: () =>
		queryOptions({
			queryKey: [...authQueries.base(), authQueries.me.name],
			queryFn: getUserSessionServerFn,
		}),
};
