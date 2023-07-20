import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import { DeleteCollectionItem, Loading } from "~/components";
import { useCollectionItemDetails } from "~/hooks/useCollectionItemDetails";
import { api } from "~/utils/api";

export default function CollectionItemPage() {
	const router = useRouter();
	const { id } = router.query;

	if (router.isReady && typeof id === "string") {
		return <CollectionItem id={id} />;
	}

	return <Loading />;
}

function CollectionItem({ id }: { id: string }) {
	const { data: currentUser } = api.users.me.useQuery();

	const {
		collectionItem,
		title,
		isUncollectedByCurrentUser,
		isCurrentUserCollectionItemOwner,
		isLoading,
	} = useCollectionItemDetails({ id, currentUser });

	if (isLoading) return <Loading />;

	if (!(collectionItem?.id && collectionItem.url && collectionItem.item?.id))
		return notFound();

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
			{isUncollectedByCurrentUser && (
				<Link
					className="btn btn-secondary"
					href={`/collect?itemId=${collectionItem.item.id}`}
				>
					Found It Too?
				</Link>
			)}
			{isCurrentUserCollectionItemOwner && (
				<Link className="btn btn-secondary" href={"/collect"}>
					Find More Stuff!
				</Link>
			)}
			<Link
				className="btn btn-secondary"
				href={`/items/${collectionItem.item.id}`}
			>
				See who found this
			</Link>
			{currentUser?.role === "ADMIN" && (
				<DeleteCollectionItem id={collectionItem.id} />
			)}
		</div>
	);
}
