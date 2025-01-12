import { db } from "@claudiorivera/db";
import "server-only";
import { getSessionOrThrow } from "~/lib/auth-utils";

export async function getUsersWhoCollectedItem(itemId: string) {
	await getSessionOrThrow();

	return db.user.findMany({
		where: {
			collectionItems: {
				some: {
					itemId: {
						equals: itemId,
					},
				},
			},
		},
		include: {
			collectionItems: {
				select: {
					id: true,
					itemId: true,
				},
			},
		},
	});
}

export type UserWithCollectionItems = Awaited<
	ReturnType<typeof getUsersWhoCollectedItem>
>[number];
