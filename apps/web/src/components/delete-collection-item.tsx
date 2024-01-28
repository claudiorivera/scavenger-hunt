"use client";

import classNames from "classnames";
import { useRouter } from "next/navigation";

import type { CollectionItem } from "@claudiorivera/db";

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
		<button
			type="button"
			className={classNames("btn-error btn", {
				loading: isLoading,
			})}
			onClick={() => deleteCollectionItem(id)}
			disabled={isLoading}
		>
			Delete this Collection Item
		</button>
	);
}
