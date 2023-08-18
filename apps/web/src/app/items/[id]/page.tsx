"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import { api } from "~/utils/api";
import { Avatar } from "~/components/Avatar";
import { EyeIcon } from "~/components/EyeIcon";
import { Loading } from "~/components/Loading";
import { useItemDetails } from "~/hooks/useItemDetails";

export default function ItemPage({ params }: { params: { id: string } }) {
	const { data: currentUser } = api.user.me.useQuery();

	const { users, item, isUncollectedByCurrentUser, isLoading } = useItemDetails(
		{
			id: params.id,
			currentUser,
		},
	);

	if (isLoading) return <Loading />;

	if (!(item?.id && item.description)) return notFound();

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">{item.description}</header>
			<div className="text-2xl">Collected By:</div>
			{users.length ? (
				<ul className="flex flex-col gap-4 pb-4">
					{users.map((user) => {
						const collectionItem = user.collectionItems.find(
							(collectionItem) => collectionItem.itemId === item.id,
						);

						return (
							<li key={user.id} className="flex items-center gap-4">
								<Link href={`/users/${user.id}`}>
									<Avatar imageSrc={user?.imageUrl} size="sm" />
								</Link>
								<div className="flex-1 text-left">
									{user?.firstName} {user?.lastName}
								</div>
								{!!collectionItem?.id && (
									<Link
										className="btn btn-secondary"
										href={`/collection-items/${collectionItem.id}`}
									>
										<EyeIcon />
									</Link>
								)}
							</li>
						);
					})}
				</ul>
			) : (
				<div className="text-2xl">Nobody, yet 😢</div>
			)}
			{isUncollectedByCurrentUser && (
				<Link className="btn btn-secondary" href={`/collect?itemId=${item.id}`}>
					Found It?
				</Link>
			)}
		</div>
	);
}
