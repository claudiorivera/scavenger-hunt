import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { editProfileServerFn } from "@/server-funcs/user";

export function useEditProfile() {
	const editProfile = useServerFn(editProfileServerFn);

	return useMutation({
		mutationFn: editProfile,
	});
}
