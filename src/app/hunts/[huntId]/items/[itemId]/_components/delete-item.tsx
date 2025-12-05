"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { deleteItemAction } from "@/app/hunts/[huntId]/items/[itemId]/actions";
import { LoadingButton } from "@/components/loading-button";
import type { Item } from "@/server/db";

export function DeleteItem({ id, huntId }: { id: Item["id"]; huntId: string }) {
	const router = useRouter();

	const { execute, status } = useAction(deleteItemAction, {
		onSuccess: () => router.push(`/hunts/${huntId}/items`),
	});

	const isPending = status === "executing";

	return (
		<form action={execute} className="flex flex-col">
			<input type="hidden" name="huntId" value={huntId} />
			<input type="hidden" name="itemId" value={id} />
			<LoadingButton isLoading={isPending}>Delete this Item</LoadingButton>
		</form>
	);
}
