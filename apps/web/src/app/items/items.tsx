"use client";

import Link from "next/link";

import { api } from "~/utils/api";
import { AddItemForm } from "~/components/AddItemForm";
import { CheckCircleIcon } from "~/components/CheckCircleIcon";
import { MinusCircleIcon } from "~/components/MinusCircleIcon";

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
							<div className="absolute -right-8 text-warning">
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
							<div className="absolute -right-8 text-success">
								<CheckCircleIcon />
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
