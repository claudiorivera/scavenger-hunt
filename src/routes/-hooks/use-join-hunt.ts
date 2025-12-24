import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { joinHuntServerFn } from "@/server-funcs/hunts";

export function useJoinHunt() {
	const joinHunt = useServerFn(joinHuntServerFn);

	return useMutation({
		mutationFn: joinHunt,
	});
}
