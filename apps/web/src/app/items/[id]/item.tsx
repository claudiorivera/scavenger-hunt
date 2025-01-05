"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteItem } from "~/components/delete-item";
import { EyeIcon } from "~/components/eye-icon";
import { Loading } from "~/components/loading";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useItemDetails } from "~/hooks/use-item-details";
import { getInitials } from "~/lib/get-initials";
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
				<Button variant="secondary" asChild>
					<Link href={`/collect?itemId=${item.id}`}>Found It?</Link>
				</Button>
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
							<Avatar>
								<AvatarImage src={user.image ?? undefined} />
								<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
							</Avatar>
						</Link>
						<div className="flex-1 text-left">{user.name}</div>
						{!!collectionItem?.id && (
							<Button variant="secondary" asChild>
								<Link href={`/collection-items/${collectionItem.id}`}>
									<EyeIcon />
								</Link>
							</Button>
						)}
					</li>
				);
			})}
		</ul>
	);
}
