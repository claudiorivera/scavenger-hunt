"use client";
import { type CollectionItem } from "@claudiorivera/db";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";

type Props = {
	id: CollectionItem["id"];
};

export function DeleteCollectionItem({ id }: Props) {
	const router = useRouter();

	const { mutate: deleteCollectionItem, isLoading } =
		api.collectionItems.delete.useMutation({
			onSuccess: () => router.push("/leaderboard"),
		});

	return (
		<button
			className={classNames("btn btn-error", {
				loading: isLoading,
			})}
			onClick={() => deleteCollectionItem(id)}
			disabled={isLoading}
		>
			Delete this Collection Item
		</button>
	);
}
