"use client";

import Image from "next/image";
import Link from "next/link";

import { api } from "~/utils/api";
import { Loading } from "~/components/Loading";
import { useCollectionItemDetails } from "~/hooks/useCollectionItemDetails";

export default function CollectionItemPage({
	params,
}: {
	params: { id: string };
}) {
	const { data: currentUser } = api.users.me.useQuery();

	const {
		collectionItem,
		title,
		isUncollectedByCurrentUser,
		isCurrentUserOwner,
		isLoading,
	} = useCollectionItemDetails({
		id: params.id,
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
				<Link
					className="btn btn-secondary"
					href={`/collect?itemId=${collectionItem.item.id}`}
				>
					Found It Too?
				</Link>
			)}
			{isCurrentUserOwner && (
				<Link className="btn btn-secondary" href={"/collect"}>
					Find More Stuff!
				</Link>
			)}
			{!!collectionItem?.item && (
				<Link
					className="btn btn-secondary"
					href={`/items/${collectionItem.item.id}`}
				>
					See who found this
				</Link>
			)}
		</div>
	);
}
