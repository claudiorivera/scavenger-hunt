import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DeleteCollectionItem } from "~/components/delete-collection-item";
import { Button } from "~/components/ui/button";

export default async function CollectionItemPage(props: {
	params: Promise<{ id: string }>;
}) {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	const { id } = await props.params;

	const collectionItem = await db.collectionItem.findUnique({
		where: { id },
		select: {
			id: true,
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
			url: true,
			width: true,
			height: true,
		},
	});

	if (!collectionItem) return notFound();

	const currentUser = await db.user.findUniqueOrThrow({
		where: {
			id: session.user.id,
		},
		select: {
			id: true,
			name: true,
			image: true,
			collectionItems: {
				select: {
					itemId: true,
				},
			},
			role: true,
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
			<div className="aspect-square max-w-sm">
				<Image
					src={collectionItem.url}
					width={collectionItem.width}
					height={collectionItem.height}
					alt={title}
					className="h-full w-full bg-black object-contain"
				/>
			</div>
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
