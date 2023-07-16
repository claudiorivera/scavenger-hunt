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
		api.collectionItem.delete.useMutation();

	return (
		<button
			className={classNames("btn btn-error", {
				loading: isLoading,
			})}
			onClick={() =>
				deleteCollectionItem(id, {
					onSuccess: () => router.push("/leaderboard"),
				})
			}
			disabled={isLoading}
		>
			Delete this Collection Item
		</button>
	);
}
