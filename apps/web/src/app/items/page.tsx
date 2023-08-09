"use client";

import Link from "next/link";

import { api } from "~/utils/api";
import { CheckCircleIcon } from "~/components/CheckCircleIcon";
import { MinusCircleIcon } from "~/components/MinusCircleIcon";

export default function ItemsPage() {
	const { data: uncollectedItems = [] } = api.items.uncollected.useQuery();
	const { data: collectedItems = [] } = api.items.collected.useQuery();

	const totalItems = uncollectedItems.length + collectedItems.length;

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">All Items</header>
			<div>
				Found {collectedItems.length} out of {totalItems} items! 📷
			</div>
			<ul className="flex flex-col gap-4">
				{uncollectedItems.map((item) => (
					<li key={item.id}>
						<div className="relative flex items-center gap-2">
							<Link
								className="btn btn-secondary flex-1"
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
								className="btn btn-secondary flex-1"
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
