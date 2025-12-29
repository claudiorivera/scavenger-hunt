import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteItemServerFn } from "@/server-funcs/item";

export function useDeleteItem() {
	const deleteItem = useServerFn(deleteItemServerFn);

	return useMutation({
		mutationFn: deleteItem,
	});
}
