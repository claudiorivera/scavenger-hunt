import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteUserServerFn } from "@/server-funcs/users";

export function useDeleteUser() {
	const deleteUser = useServerFn(deleteUserServerFn);

	return useMutation({
		mutationFn: deleteUser,
	});
}
