import { db } from "@claudiorivera/db";
import "server-only";
import { getSessionOrThrow } from "~/lib/auth-utils";

export async function getLeaderboardUsers() {
	await getSessionOrThrow();

	return db.user.findMany({
		include: {
			_count: true,
		},
	});
}
