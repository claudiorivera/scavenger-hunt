import { type CollectionItem } from "@claudiorivera/db";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";

export function DeleteCollectionItem({ id }: { id: CollectionItem["id"] }) {
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
