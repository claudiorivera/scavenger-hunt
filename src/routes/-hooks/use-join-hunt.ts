import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { huntQueries } from "@/queries/hunt";
import { participationQueries } from "@/queries/participation";
import { joinHuntServerFn } from "@/server-funcs/hunt";

export function useJoinHunt() {
	const joinHunt = useServerFn(joinHuntServerFn);

	return useMutation({
		mutationFn: joinHunt,
		onSettled: (_data, _error, _variables, _onMutateResult, context) => {
			context.client.invalidateQueries({
				queryKey: participationQueries.mine().queryKey,
			});
			context.client.invalidateQueries({
				queryKey: huntQueries.available().queryKey,
			});
		},
	});
}
