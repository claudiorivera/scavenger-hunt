import Image from "next/image";
import Link from "next/link";
import { DeleteCollectionItem } from "~/app/collection-items/[id]/_components/delete-collection-item";
import { Button } from "~/components/ui/button";
import { getSessionOrThrow } from "~/lib/auth-utils";
import { getCollectionItem, getCurrentUser } from "~/server/api";

export default async function CollectionItemPage(props: {
	params: Promise<{ id: string }>;
}) {
	const session = await getSessionOrThrow();

	const { id } = await props.params;

	const [collectionItem, currentUser] = await Promise.all([
		getCollectionItem(id),
		getCurrentUser(),
	]);

	const title = `${collectionItem.user.name} has found ${collectionItem.item.description}!`;
	const hasCurrentUserCollected = currentUser.collectionItems.some(
		(item) => item.itemId === collectionItem.item.id,
	);
	const isCurrentUserOwner = collectionItem.user.id === currentUser.id;

	return (
		<div className="flex flex-col gap-4">
			<header className="text-2xl">{title}</header>

			<Image
				src={collectionItem.url}
				width={collectionItem.width}
				height={collectionItem.height}
				alt={title}
				className="aspect-square h-full w-full max-w-sm bg-black object-contain"
			/>

			{!hasCurrentUserCollected && (
				<Button variant="secondary" asChild>
					<Link href={`/collect?itemId=${collectionItem.item.id}`}>
						Found It Too?
					</Link>
				</Button>
			)}

			{isCurrentUserOwner && (
				<Button variant="secondary" asChild>
					<Link href="/collect">Find More Stuff!</Link>
				</Button>
			)}

			<Button variant="secondary" asChild>
				<Link href={`/items/${collectionItem.item.id}`}>
					See who found this
				</Link>
			</Button>

			{session.user.role === "ADMIN" && (
				<DeleteCollectionItem id={collectionItem.id} />
			)}
		</div>
	);
}
