"use client";

import classNames from "classnames";
import { useRouter } from "next/navigation";

import type { Item } from "@claudiorivera/db";

import { api } from "~/utils/api";

export function DeleteItem({ id }: { id: Item["id"] }) {
	const router = useRouter();

	const { mutate: deleteItem, isLoading } = api.items.delete.useMutation({
		onSuccess: () => {
			router.refresh();
			router.push("/items");
		},
	});

	return (
		<button
			type="button"
			className={classNames("btn-error btn", {
				loading: isLoading,
			})}
			onClick={() => deleteItem(id)}
			disabled={isLoading}
		>
			Delete this Item
		</button>
	);
}
