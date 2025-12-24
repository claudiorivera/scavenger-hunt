import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { huntQueries } from "@/queries/hunt";
import { participationQueries } from "@/queries/participation";
import { leaveHuntServerFn } from "@/server-funcs/hunts";

export function useLeaveHunt() {
	const leaveHunt = useServerFn(leaveHuntServerFn);

	return useMutation({
		mutationFn: leaveHunt,
		onSettled: (_data, _error, _variables, _onMutateResult, context) =>
			Promise.all([
				context.client.invalidateQueries({
					queryKey: participationQueries.mine().queryKey,
				}),
				context.client.invalidateQueries({
					queryKey: huntQueries.available().queryKey,
				}),
			]),
	});
}
