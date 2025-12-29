import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteHuntServerFn } from "@/server-funcs/hunt";

export function useDeleteHunt() {
	const deleteHunt = useServerFn(deleteHuntServerFn);

	return useMutation({
		mutationFn: deleteHunt,
	});
}
