"use client";

import classNames from "classnames";

import type { User } from "@claudiorivera/db";

import { TrashIcon } from "~/components/TrashIcon";
import { api } from "~/utils/api";

export function DeleteUser({ id }: { id: User["id"] }) {
	const utils = api.useContext();
	const { mutate: deleteUser, isLoading } = api.users.deleteById.useMutation();

	return (
		<button
			type="button"
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
