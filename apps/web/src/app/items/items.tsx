"use client";

import Link from "next/link";

import { AddItemForm } from "~/components/add-item-form";
import { CheckCircleIcon } from "~/components/check-circle-icon";
import { MinusCircleIcon } from "~/components/minus-circle-icon";
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
							<Link
								className="btn-secondary btn flex-1"
								href={`/items/${item.id}`}
							>
								{item.description}
							</Link>
							<div className="text-warning absolute -right-8">
								<MinusCircleIcon />
							</div>
						</div>
					</li>
				))}
				{collectedItems.map((item) => (
					<li key={item.id}>
						<div className="relative flex items-center gap-2">
							<Link
								className="btn-secondary btn flex-1"
								href={`/items/${item.id}`}
							>
								{item.description}
							</Link>
							<div className="text-success absolute -right-8">
								<CheckCircleIcon />
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
