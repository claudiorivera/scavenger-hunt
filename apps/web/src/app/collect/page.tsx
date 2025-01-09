import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ImageUpload } from "~/components/image-upload";
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

	return (
		<div className="flex flex-col gap-4 text-center">
			<header className="text-2xl">Find</header>
			<div className="text-3xl">{item.description}</div>
			<ImageUpload itemId={item.id} />
			<Button variant="secondary" asChild>
				<Link href={`/items/${item.id}`}>See who found this</Link>
			</Button>
		</div>
	);
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
