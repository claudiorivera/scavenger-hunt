import { type Item } from "@claudiorivera/db";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";

export function DeleteItem({ id }: { id: Item["id"] }) {
	const router = useRouter();

	const { mutate: deleteItem, isLoading } = api.items.delete.useMutation({
		onSuccess: () => router.push("/items"),
	});

	return (
		<button
			className={classNames("btn btn-error", {
				loading: isLoading,
			})}
			onClick={() => deleteItem(id)}
			disabled={isLoading}
		>
			Delete this Item
		</button>
	);
}
