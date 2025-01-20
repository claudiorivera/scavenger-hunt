import Image from "next/image";
import Link from "next/link";
import { DeleteCollectionItem } from "~/app/hunts/[huntId]/collection-items/[collectionItemId]/_components/delete-collection-item";
import { Button } from "~/components/ui/button";
import { can } from "~/lib/permissions";
import { getCollectionItem, getCurrentUser } from "~/server/api";

export default async function CollectionItemPage(props: {
	params: Promise<{ collectionItemId: string; huntId: string }>;
}) {
	const user = await getCurrentUser();

	const { collectionItemId, huntId } = await props.params;

	const [collectionItem, currentUser] = await Promise.all([
		getCollectionItem(collectionItemId),
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
					<Link
						href={`/hunts/${huntId}/collect?itemId=${collectionItem.item.id}`}
					>
						Found It Too?
					</Link>
				</Button>
			)}

			{isCurrentUserOwner && (
				<Button variant="secondary" asChild>
					<Link href={`/hunts/${huntId}/collect`}>Find More Stuff!</Link>
				</Button>
			)}

			<Button variant="secondary" asChild>
				<Link href={`/hunts/${huntId}/items/${collectionItem.item.id}`}>
					See who found this
				</Link>
			</Button>

			{can(user).deleteCollectionItem(collectionItem) && (
				<DeleteCollectionItem id={collectionItem.id} />
			)}
		</div>
	);
}
