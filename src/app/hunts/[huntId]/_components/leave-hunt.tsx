"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { leaveHuntAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import type { Hunt } from "@/server/db";

export function LeaveHunt({ id }: { id: Hunt["id"] }) {
	const router = useRouter();

	const { execute, status } = useAction(leaveHuntAction, {
		onSuccess: async () => router.push("/"),
	});

	const isPending = status === "executing";

	return (
		<Button
			variant="destructive"
			onClick={() => execute({ id: id })}
			disabled={isPending}
		>
			{isPending ? "Leaving Hunt..." : "Leave Hunt"}
		</Button>
	);
}
