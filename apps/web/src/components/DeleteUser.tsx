"use client";

import classNames from "classnames";

import type { User } from "@claudiorivera/db";

import { api } from "~/utils/api";
import { TrashIcon } from "~/components/TrashIcon";

export function DeleteUser({ id }: { id: User["id"] }) {
	const utils = api.useContext();
	const { mutate: deleteUser, isLoading } = api.user.deleteById.useMutation();

	return (
		<button
			className={classNames("btn-error btn w-12", {
				loading: isLoading,
			})}
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
		</button>
	);
}
