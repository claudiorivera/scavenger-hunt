import { auth } from "@claudiorivera/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ImageUpload } from "~/app/collect/_components/image-upload";
import { MyCollectionLink } from "~/app/collect/_components/my-collection-link";
import {
	getItemById,
	getNextUncollectedItemIdForUser,
} from "~/app/collect/_lib/api";
import { Button } from "~/components/ui/button";

export default async function CollectPage({
	searchParams,
}: {
	searchParams?: Promise<{ [key: string]: string | Array<string> | undefined }>;
}) {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	const searchParamsValue = await searchParams;

	const itemId =
		typeof searchParamsValue?.itemId === "string"
			? searchParamsValue.itemId
			: await getNextUncollectedItemIdForUser(session.user.id);

	if (!itemId) {
		return <AllItemsCollected />;
	}

	const item = await getItemById(itemId);

	if (!item) return redirect("/items");

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

function AllItemsCollected() {
	return (
		<div className="flex flex-col gap-4">
			<h3>
				You Found All The Items!&nbsp;
				<span role="img" aria-label="celebrate emoji">
					🎉
				</span>
			</h3>

			<MyCollectionLink />
		</div>
	);
}
