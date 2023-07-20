import { type User } from "@claudiorivera/db";
import classNames from "classnames";

import { TrashIcon } from "~/components";
import { api } from "~/utils/api";

export function DeleteUser({ id }: { id: User["id"] }) {
	const utils = api.useContext();
	const { mutate: deleteUser, isLoading } = api.users.deleteById.useMutation();

	return (
		<button
			className={classNames("btn btn-error w-12", {
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
