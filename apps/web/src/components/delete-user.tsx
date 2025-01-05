"use client";

import type { User } from "@claudiorivera/db";
import { LoadingButton } from "~/components/loading-button";
import { TrashIcon } from "~/components/trash-icon";
import { api } from "~/utils/api";

export function DeleteUser({ id }: { id: User["id"] }) {
	const utils = api.useContext();
	const { mutate: deleteUser, isLoading } = api.users.deleteById.useMutation();

	return (
		<LoadingButton
			isLoading={isLoading}
			onClick={() => {
				deleteUser(id, {
					onSuccess: () => {
						void utils.users.all.invalidate();
					},
				});
			}}
			disabled={isLoading}
		>
			<TrashIcon />
		</LoadingButton>
	);
}
