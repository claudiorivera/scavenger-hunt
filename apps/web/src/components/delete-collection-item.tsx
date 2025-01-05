"use client";

import type { CollectionItem } from "@claudiorivera/db";
import { useRouter } from "next/navigation";
import { LoadingButton } from "~/components/loading-button";
import { api } from "~/utils/api";

export function DeleteCollectionItem({ id }: { id: CollectionItem["id"] }) {
	const router = useRouter();

	const { mutate: deleteCollectionItem, isLoading } =
		api.collectionItems.delete.useMutation({
			onSuccess: () => {
				router.refresh();
				router.push("/leaderboard");
			},
		});

	return (
		<LoadingButton
			onClick={() => deleteCollectionItem(id)}
			isLoading={isLoading}
		>
			Delete this Collection Item
		</LoadingButton>
	);
}
