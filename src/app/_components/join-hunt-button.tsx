"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { joinHuntAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import type { Hunt } from "@/server/db";

export function JoinHuntButton({ id }: { id: Hunt["id"] }) {
	const router = useRouter();

	const { execute, status } = useAction(joinHuntAction, {
		onSuccess: async () => router.push(`/hunts/${id}`),
	});

	const isPending = status === "executing";

	return (
		<Button
			variant="secondary"
			onClick={() => execute({ id })}
			disabled={isPending}
		>
			{isPending ? "Joining..." : "Join"}
		</Button>
	);
}
