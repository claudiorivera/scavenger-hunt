import type { Item } from "@claudiorivera/db";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import { AddItemForm } from "~/app/items/_components/add-item-form";
import { getItems } from "~/app/items/_lib/api";
import { Button } from "~/components/ui/button";
import { getSessionOrThrow } from "~/lib/auth-utils";

export default async function ItemsPage() {
	const session = await getSessionOrThrow();
	const {
		collectedItems = [],
		totalItems = 0,
		uncollectedItems = [],
	} = await getItems();

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">All Items</header>
			{session.user.role === "ADMIN" && <AddItemForm />}
			<div>
				Found {collectedItems.length} out of {totalItems} items! 📷
			</div>
			<ul className="flex flex-col gap-4">
				{uncollectedItems.map((item) => (
					<ItemLink key={item.id} item={item} />
				))}
				{collectedItems.map((item) => (
					<ItemLink key={item.id} item={item} isCollected />
				))}
			</ul>
		</div>
	);
}

function ItemLink({
	item,
	isCollected = false,
}: { item: Item; isCollected?: boolean }) {
	return (
		<li>
			<div className="relative flex items-center gap-2">
				<Button variant="secondary" asChild className="flex-1">
					<Link href={`/items/${item.id}`}>{item.description}</Link>
				</Button>
				{isCollected && (
					<div className="-right-6 absolute text-success">
						<CheckCircleIcon className="h-4 w-4" />
					</div>
				)}
			</div>
		</li>
	);
}
