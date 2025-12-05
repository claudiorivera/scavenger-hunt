"use client";

import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { deleteUserAction } from "@/app/hunts/[huntId]/leaderboard/actions";
import { LoadingButton } from "@/components/loading-button";
import type { User } from "@/server/db/types";

export function DeleteUser({
	id,
	successUrl,
}: {
	id: User["id"];
	successUrl: string;
}) {
	const router = useRouter();

	const { execute, status } = useAction(deleteUserAction, {
		onSuccess: () => router.push(successUrl),
	});

	const isPending = status === "executing";

	return (
		<form action={execute}>
			<input type="hidden" name="userId" value={id} />
			<LoadingButton isLoading={isPending}>
				<TrashIcon />
			</LoadingButton>
		</form>
	);
}
