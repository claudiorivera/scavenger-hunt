"use client";

import { joinHuntAction } from "~/app/actions";
import { Button } from "~/components/ui/button";

export function JoinButton({ huntId }: { huntId: string }) {
	return (
		<Button
			variant="secondary"
			onClick={async () =>
				await joinHuntAction({
					huntId,
				})
			}
		>
			Join
		</Button>
	);
}
