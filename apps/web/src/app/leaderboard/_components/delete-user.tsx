"use client";

import type { User } from "@claudiorivera/db";
import { TrashIcon } from "lucide-react";
import { useActionState } from "react";
import { deleteUser } from "~/app/leaderboard/actions";
import { LoadingButton } from "~/components/loading-button";

export function DeleteUser({ id }: { id: User["id"] }) {
	const [_state, action, isPending] = useActionState(deleteUser, undefined);

	return (
		<form action={action}>
			<input type="hidden" name="userId" value={id} />
			<LoadingButton isLoading={isPending}>
				<TrashIcon />
			</LoadingButton>
		</form>
	);
}
