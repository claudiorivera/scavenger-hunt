"use client";
import { type User } from "@prisma/client";
import classNames from "classnames";

import { TrashIcon } from "~/components";
import { api } from "~/utils/api";

type Props = {
	id: User["id"];
};

export function DeleteUser({ id }: Props) {
	const utils = api.useContext();
	const { mutate: deleteUser, isLoading } = api.user.deleteById.useMutation();

	return (
		<button
			className={classNames("btn btn-error w-12", {
				loading: isLoading,
			})}
			onClick={() => {
				deleteUser(id, {
					onSuccess: () => {
						void utils.user.all.invalidate();
					},
				});
			}}
			disabled={isLoading}
		>
			<TrashIcon />
		</button>
	);
}
