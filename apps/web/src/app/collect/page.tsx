import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ImageUpload } from "~/app/collect/_components/image-upload";
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
	});

	if (!item) {
		return (
			<div className="flex flex-col gap-4">
				<h3>
					You Found All The Items!&nbsp;
					<span role="img" aria-label="celebrate emoji">
						🎉
					</span>
				</h3>

				<Button variant="secondary" asChild>
					<Link href={`/users/${session.user.id}`}>My Collection</Link>
				</Button>
			</div>
		);
	}

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
