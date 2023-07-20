import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import { HiUserCircle } from "react-icons/hi";

import { DeleteItem, Loading } from "~/components";
import { EyeIcon } from "~/components/EyeIcon";
import { useItemDetails } from "~/hooks/useItemDetails";
import { api, type RouterOutputs } from "~/utils/api";

export default function ItemPage() {
	const router = useRouter();
	const { id } = router.query;

	if (router.isReady && typeof id === "string") {
		return <Item id={id} />;
	}

	return <Loading />;
}

function Item({ id }: { id: string }) {
	const { data: currentUser } = api.users.me.useQuery();

	const { users, item, isUncollectedByCurrentUser, isLoading } = useItemDetails(
		{
			id,
			currentUser,
		},
	);

	if (isLoading) return <Loading />;

	if (!(item?.id && item.description && !!users)) return notFound();

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">{item.description}</header>
			<div className="text-2xl">Collected By:</div>
			{!!users.length ? (
				<UsersList users={users} itemId={item.id} />
			) : (
				<div className="text-2xl">Nobody, yet 😢</div>
			)}
			{isUncollectedByCurrentUser && (
				<Link className="btn btn-secondary" href={`/collect?itemId=${item.id}`}>
					Found It?
				</Link>
			)}
			{currentUser?.role === "ADMIN" && <DeleteItem id={item.id} />}
		</div>
	);
}

const UsersList = ({
	users,
	itemId,
}: {
	users: RouterOutputs["users"]["withItemIdInCollection"];
	itemId: string;
}) => (
	<ul className="flex flex-col gap-4 pb-4">
		{users.map((user) => {
			const collectionItem = user.collectionItems.find(
				(item) => item.itemId === itemId,
			);

			return (
				<li key={user.id} className="flex items-center gap-4">
					<Link href={`/users/${user.id}`}>
						<div className="avatar">
							<div className="relative h-14 w-14 rounded-full">
								{user.image ? (
									<Image
										src={user.image}
										fill
										alt={`${user.name}`}
										sizes="33vw"
									/>
								) : (
									<HiUserCircle className="h-full w-full" />
								)}
							</div>
						</div>
					</Link>
					<div className="flex-1 text-left">{user.name}</div>
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
);
