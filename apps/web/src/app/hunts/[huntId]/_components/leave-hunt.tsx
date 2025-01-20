"use client";

import { leaveHuntAction } from "~/app/actions";
import { Button } from "~/components/ui/button";

export function LeaveHunt({ huntId }: { huntId: string }) {
	return (
		<Button
			variant="destructive"
			onClick={async () =>
				await leaveHuntAction({
					huntId,
				})
			}
		>
			Leave Hunt
		</Button>
	);
}
