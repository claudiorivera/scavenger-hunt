import Link from "next/link";

import { AddItemForm, CheckCircleIcon, MinusCircleIcon } from "~/components";
import { api } from "~/utils/api";

export default function ItemsPage() {
	const { data: currentUser } = api.user.me.useQuery();
	const { data: uncollectedItems = [] } = api.item.uncollected.useQuery();
	const { data: collectedItems = [] } = api.item.collected.useQuery();

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
								className="btn btn-secondary flex-1"
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
								className="btn btn-secondary flex-1"
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
