"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar } from "~/components/avatar";
import { DeleteItem } from "~/components/delete-item";
import { EyeIcon } from "~/components/eye-icon";
import { Loading } from "~/components/loading";
import { useItemDetails } from "~/hooks/use-item-details";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

export function Item({ id }: { id: string }) {
	const { data: currentUser } = api.users.me.useQuery();

	const { users, item, isUncollectedByCurrentUser, isLoading } = useItemDetails(
		{
			id,
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
				<UsersList users={users} itemId={item.id} />
			) : (
				<div className="text-2xl">Nobody, yet 😢</div>
			)}
			{isUncollectedByCurrentUser && (
				<Link className="btn-secondary btn" href={`/collect?itemId=${item.id}`}>
					Found It?
				</Link>
			)}
			{currentUser?.role === "ADMIN" && <DeleteItem id={item.id} />}
		</div>
	);
}

function UsersList({
	users,
	itemId,
}: {
	users: RouterOutputs["users"]["withItemIdInCollection"];
	itemId: string;
}) {
	return (
		<ul className="flex flex-col gap-4 pb-4">
			{users.map((user) => {
				const collectionItem = user.collectionItems.find(
					(item) => item.itemId === itemId,
				);

				return (
					<li key={user.id} className="flex items-center gap-4">
						<Link href={`/users/${user.id}`}>
							<Avatar imageSrc={user.image} size="sm" />
						</Link>
						<div className="flex-1 text-left">{user.name}</div>
						{!!collectionItem?.id && (
							<Link
								className="btn-secondary btn"
								href={`/collection-items/${collectionItem.id}`}
							>
								<EyeIcon />
							</Link>
						)}
					</li>
				);
			})}
		</ul>
	);
}
