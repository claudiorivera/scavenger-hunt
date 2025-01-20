"use client";

import type { Hunt } from "@claudiorivera/db";
import { useActionState } from "react";
import { deleteHunt } from "~/app/hunts/[huntId]/actions";
import { LoadingButton } from "~/components/loading-button";

export function DeleteHunt({ id }: { id: Hunt["id"] }) {
	const [_state, action, isPending] = useActionState(deleteHunt, null);

	return (
		<form action={action} className="flex flex-col">
			<input type="hidden" name="huntId" value={id} />
			<LoadingButton variant="destructive" isLoading={isPending}>
				Delete Hunt
			</LoadingButton>
		</form>
	);
}
