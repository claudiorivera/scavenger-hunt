import { db } from "@claudiorivera/db";
import "server-only";
import { getSessionOrThrow } from "~/lib/auth-utils";

export async function getUserById(id: string) {
	await getSessionOrThrow();

	return db.user.findUniqueOrThrow({
		where: {
			id,
		},
		include: {
			collectionItems: {
				include: {
					item: true,
				},
			},
		},
	});
}
