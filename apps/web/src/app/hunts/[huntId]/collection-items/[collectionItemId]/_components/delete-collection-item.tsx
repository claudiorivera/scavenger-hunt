"use client";

import type { CollectionItem } from "@claudiorivera/db";
import { useActionState } from "react";
import { deleteCollectionItem } from "~/app/hunts/[huntId]/collection-items/[collectionItemId]/actions";
import { LoadingButton } from "~/components/loading-button";

export function DeleteCollectionItem({ id }: { id: CollectionItem["id"] }) {
	const [_state, action, isPending] = useActionState(
		deleteCollectionItem,
		null,
	);

	return (
		<form action={action} className="flex flex-col">
			<input type="hidden" name="collectionItemId" value={id} />
			<LoadingButton isLoading={isPending}>
				Delete this Collection Item
			</LoadingButton>
		</form>
	);
}
