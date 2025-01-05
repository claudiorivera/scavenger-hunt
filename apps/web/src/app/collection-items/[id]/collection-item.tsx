"use client";

import Image from "next/image";
import Link from "next/link";

import { DeleteCollectionItem } from "~/components/delete-collection-item";
import { Loading } from "~/components/loading";
import { Button } from "~/components/ui/button";
import { useCollectionItemDetails } from "~/hooks/use-collection-item-details";
import { api } from "~/utils/api";

export const CollectionItem = ({ id }: { id: string }) => {
	const { data: currentUser } = api.users.me.useQuery();

	const {
		collectionItem,
		title,
		isUncollectedByCurrentUser,
		isCurrentUserOwner,
		isLoading,
	} = useCollectionItemDetails({
		id,
		currentUser,
	});

	if (isLoading) return <Loading />;

	return (
		<div className="flex flex-col gap-4">
			<header className="text-2xl">{title}</header>
			<div className="aspect-square max-w-sm">
				{!!collectionItem?.url && (
					<Image
						src={collectionItem.url}
						width={collectionItem.width}
						height={collectionItem.height}
						alt={title}
						className="h-full w-full bg-black object-contain"
					/>
				)}
			</div>
			{isUncollectedByCurrentUser && !!collectionItem?.item && (
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
			{!!collectionItem?.item && (
				<Button variant="secondary" asChild>
					<Link href={`/items/${collectionItem.item.id}`}>
						See who found this
					</Link>
				</Button>
			)}
			{currentUser?.role === "ADMIN" && <DeleteCollectionItem id={id} />}
		</div>
	);
};
