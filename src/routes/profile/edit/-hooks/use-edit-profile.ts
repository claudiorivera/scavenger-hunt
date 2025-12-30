import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { authQueries } from "@/queries/auth";
import { editProfileServerFn } from "@/server-funcs/user";

export function useEditProfile() {
	const editProfile = useServerFn(editProfileServerFn);

	return useMutation({
		mutationFn: editProfile,
		onSettled: (_data, _error, _variables, _onMutateResult, context) =>
			context.client.invalidateQueries({
				queryKey: authQueries.me().queryKey,
			}),
	});
}
