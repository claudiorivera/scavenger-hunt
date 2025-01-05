"use client";

import Link from "next/link";
import { AddItemForm } from "~/components/add-item-form";
import { CheckCircleIcon } from "~/components/check-circle-icon";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export function Items() {
	const { data: currentUser } = api.users.me.useQuery();
	const { data: uncollectedItems = [] } = api.items.uncollected.useQuery();
	const { data: collectedItems = [] } = api.items.collected.useQuery();

	const totalItems = uncollectedItems.length + collectedItems.length;

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">All Items</header>
			{currentUser?.role === "ADMIN" && <AddItemForm />}
			<div>
				Found {collectedItems.length} out of {totalItems} items! 📷
			</div>
			<ul className="flex flex-col gap-4">
				{uncollectedItems.map((item) => (
					<li key={item.id}>
						<div className="relative flex items-center gap-2">
							<Button variant="secondary" asChild className="flex-1">
								<Link href={`/items/${item.id}`}>{item.description}</Link>
							</Button>
						</div>
					</li>
				))}
				{collectedItems.map((item) => (
					<li key={item.id}>
						<div className="relative flex items-center gap-2">
							<Button variant="secondary" asChild className="flex-1">
								<Link href={`/items/${item.id}`}>{item.description}</Link>
							</Button>
							<div className="-right-8 absolute text-success">
								<CheckCircleIcon />
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
