import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteCollectionItemServerFn } from "@/server-funcs/collection-items";

export function useDeleteCollectionItem() {
	const deleteCollectionItem = useServerFn(deleteCollectionItemServerFn);

	return useMutation({
		mutationFn: deleteCollectionItem,
	});
}
