"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { deleteCollectionItemAction } from "@/app/hunts/[huntId]/collection-items/[collectionItemId]/actions";
import { LoadingButton } from "@/components/loading-button";
import type { CollectionItem } from "@/server/db/types";

export function DeleteCollectionItem({ id }: { id: CollectionItem["id"] }) {
	const router = useRouter();

	const { execute, status } = useAction(deleteCollectionItemAction, {
		onSuccess: ({ data }) => router.push(`/hunts/${data.huntId}/leaderboard`),
	});

	const isPending = status === "executing";

	return (
		<form action={execute} className="flex flex-col">
			<input type="hidden" name="collectionItemId" value={id} />
			<LoadingButton isLoading={isPending}>
				Delete this Collection Item
			</LoadingButton>
		</form>
	);
}
