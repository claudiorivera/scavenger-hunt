import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Collect } from "~/app/collect/collect";
import { Button } from "~/components/ui/button";

export default async function CollectPage() {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	const item = await db.item.findFirst({
		where: {
			collectionItems: {
				none: {
					user: {
						id: session.user.id,
					},
				},
			},
		},
		select: {
			id: true,
			description: true,
		},
	});

	if (!item) return <AllItemsFound userId={session.user.id} />;

	return <Collect item={item} />;
}

function AllItemsFound({ userId }: { userId: string }) {
	return (
		<div className="flex flex-col gap-4">
			<h3>
				You Found All The Items!&nbsp;
				<span role="img" aria-label="celebrate emoji">
					🎉
				</span>
			</h3>
			<Button variant="secondary" asChild>
				<Link href={`/users/${userId}`}>My Collection</Link>
			</Button>
		</div>
	);
}
