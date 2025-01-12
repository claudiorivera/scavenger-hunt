import { db } from "@claudiorivera/db";
import "server-only";
import { getSessionOrThrow } from "~/lib/auth-utils";

export async function getCurrentUser() {
	const session = await getSessionOrThrow();

	return db.user.findUniqueOrThrow({
		where: {
			id: session.user.id,
		},
	});
}
