"use client";

import type { Item } from "@claudiorivera/db";
import { useRouter } from "next/navigation";
import { LoadingButton } from "~/components/loading-button";
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
		<LoadingButton onClick={() => deleteItem(id)} isLoading={isLoading}>
			Delete this Item
		</LoadingButton>
	);
}
