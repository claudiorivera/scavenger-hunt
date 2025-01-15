"use client";

import type { Item } from "@claudiorivera/db";
import { useActionState } from "react";
import { deleteItem } from "~/app/hunts/[huntId]/items/[itemId]/actions";
import { LoadingButton } from "~/components/loading-button";

export function DeleteItem({ id }: { id: Item["id"] }) {
	const [_state, action, isPending] = useActionState(deleteItem, null);

	return (
		<form action={action} className="flex flex-col">
			<input type="hidden" name="itemId" value={id} />
			<LoadingButton isLoading={isPending}>Delete this Item</LoadingButton>
		</form>
	);
}
