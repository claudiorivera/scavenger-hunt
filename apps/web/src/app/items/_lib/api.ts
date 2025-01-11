import { db } from "@claudiorivera/db";
import "server-only";
import { getSessionOrThrow } from "~/lib/auth-utils";

export async function getItems() {
	const session = await getSessionOrThrow();

	const items = await db.item.findMany({
		include: {
			collectionItems: true,
		},
	});

	const mappedItems = items.reduce(
		(acc, item) => {
			const isCollected = item.collectionItems.some(
				(collectionItem) => collectionItem.userId === session.user.id,
			);

			acc.set(isCollected ? "collected" : "uncollected", [
				...(acc.get(isCollected ? "collected" : "uncollected") ?? []),
				item,
			]);

			return acc;
		},
		new Map<"collected" | "uncollected", typeof items>([
			["collected", []],
			["uncollected", []],
		]),
	);

	return {
		collectedItems: mappedItems.get("collected"),
		uncollectedItems: mappedItems.get("uncollected"),
		totalItems: items.length,
	};
}
