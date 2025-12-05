"use client";

import { useParams, useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { createItemAction } from "@/app/hunts/[huntId]/items/actions";
import { LoadingButton } from "@/components/loading-button";
import { Input } from "@/components/ui/input";

export function AddItemForm() {
	const { huntId } = useParams();
	const router = useRouter();

	const { execute, status } = useAction(createItemAction, {
		onSuccess: () => router.push(`/hunts/${huntId}/items`),
	});

	const isPending = status === "executing";

	return (
		<div className="flex flex-col items-center gap-4">
			<form className="flex w-full flex-col gap-2" action={execute}>
				<input type="hidden" name="huntId" value={huntId} />
				<Input name="description" placeholder="Something Awesome" />

				<LoadingButton type="submit" variant="secondary" isLoading={isPending}>
					Add Item
				</LoadingButton>
			</form>
		</div>
	);
}
