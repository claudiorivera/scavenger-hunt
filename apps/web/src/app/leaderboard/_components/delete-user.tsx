"use client";

import type { User } from "@claudiorivera/db";
import { TrashIcon } from "lucide-react";
import { LoadingButton } from "~/components/loading-button";
import { api } from "~/lib/api";

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
