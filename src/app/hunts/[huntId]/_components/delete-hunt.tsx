"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { deleteHuntAction } from "@/app/hunts/[huntId]/actions";
import { LoadingButton } from "@/components/loading-button";
import type { Hunt } from "@/server/db/types";

export function DeleteHunt({ id }: { id: Hunt["id"] }) {
	const router = useRouter();

	const { execute, status } = useAction(deleteHuntAction, {
		onSuccess: () => router.push("/"),
	});

	const isPending = status === "executing";

	return (
		<form action={execute} className="flex flex-col">
			<input type="hidden" name="huntId" value={id} />
			<LoadingButton variant="destructive" isLoading={isPending}>
				Delete Hunt
			</LoadingButton>
		</form>
	);
}
