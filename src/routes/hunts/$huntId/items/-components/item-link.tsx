import { Link } from "@tanstack/react-router";
import { CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Item } from "@/db/types";

export function ItemLink({
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
					<Link
						to="/hunts/$huntId/items/$itemId"
						params={{
							huntId,
							itemId: item.id,
						}}
					>
						{item.description}
					</Link>
				</Button>
				{isCollected && (
					<div className="absolute -right-6 text-success">
						<CheckCircleIcon className="h-4 w-4" />
					</div>
				)}
			</div>
		</li>
	);
}
