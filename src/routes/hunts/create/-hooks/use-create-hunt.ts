import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createHuntServerFn } from "@/server-funcs/hunt";

export function useCreateHunt() {
	const createHunt = useServerFn(createHuntServerFn);

	return useMutation({
		mutationFn: createHunt,
	});
}
