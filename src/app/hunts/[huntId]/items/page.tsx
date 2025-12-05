import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import { AddItemForm } from "@/app/hunts/[huntId]/items/_components/add-item-form";
import { SignInButton } from "@/components/sign-in-button";
import { Button } from "@/components/ui/button";
import { can } from "@/lib/permissions";
import { getHuntOrThrow, getItemsForHunt, getSessionUser } from "@/server/api";
import type { Item } from "@/server/db/types";

export default async function ItemsPage({
	params,
}: {
	params: Promise<{ huntId: string }>;
}) {
	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		return <SignInButton />;
	}

	const { huntId } = await params;

	const hunt = await getHuntOrThrow(huntId);

	const {
		collectedItems = [],
		totalItems = 0,
		uncollectedItems = [],
	} = await getItemsForHunt(huntId);

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">All Items</header>
			{can(sessionUser).addItemToHunt(hunt) && <AddItemForm />}
			<div>
				Found {collectedItems.length} out of {totalItems} items! 📷
			</div>
			<ul className="flex flex-col gap-4">
				{uncollectedItems.map((item) => (
					<ItemLink key={item.id} item={item} huntId={huntId} />
				))}
				{collectedItems.map((item) => (
					<ItemLink key={item.id} item={item} huntId={huntId} isCollected />
				))}
			</ul>
		</div>
	);
}

function ItemLink({
	item,
	isCollected = false,
	huntId,
}: {
	item: Item;
	isCollected?: boolean;
	huntId: string;
}) {
	return (
		<li>
			<div className="relative flex items-center gap-2">
				<Button variant="secondary" asChild className="flex-1">
					<Link href={`/hunts/${huntId}/items/${item.id}`}>
						{item.description}
					</Link>
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
