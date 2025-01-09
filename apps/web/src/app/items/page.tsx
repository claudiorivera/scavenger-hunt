import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AddItemForm } from "~/app/items/_components/add-item-form";
import { Button } from "~/components/ui/button";

export default async function ItemsPage() {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	const collectedItems = await db.item.findMany({
		where: {
			collectionItems: {
				some: {
					user: {
						id: session.user.id,
					},
				},
			},
		},
	});

	const uncollectedItems = await db.item.findMany({
		where: {
			collectionItems: {
				none: {
					user: {
						id: session.user.id,
					},
				},
			},
		},
	});

	const totalItems = uncollectedItems.length + collectedItems.length;

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">All Items</header>
			{session.user.role === "ADMIN" && <AddItemForm />}
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
							<div className="-right-6 absolute text-success">
								<CheckCircleIcon className="h-4 w-4" />
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
