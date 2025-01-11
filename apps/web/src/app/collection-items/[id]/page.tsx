import { db } from "@claudiorivera/db";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteCollectionItem } from "~/app/collection-items/[id]/_components/delete-collection-item";
import { Button } from "~/components/ui/button";
import { getSessionOrThrow } from "~/lib/auth-utils";

export default async function CollectionItemPage(props: {
	params: Promise<{ id: string }>;
}) {
	const session = await getSessionOrThrow();

	const { id } = await props.params;

	const collectionItem = await db.collectionItem.findUnique({
		where: { id },
		include: {
			user: {
				select: {
					id: true,
					name: true,
				},
			},
			item: {
				select: {
					id: true,
					description: true,
				},
			},
		},
	});

	if (!collectionItem) return notFound();

	const currentUser = await db.user.findUniqueOrThrow({
		where: {
			id: session.user.id,
		},
		include: {
			collectionItems: {
				select: {
					itemId: true,
				},
			},
		},
	});

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
