import Link from "next/link";
import { DeleteItem } from "~/app/hunts/[huntId]/items/[itemId]/_components/delete-item";
import { UsersList } from "~/app/hunts/[huntId]/items/[itemId]/_components/users-list";
import { Button } from "~/components/ui/button";
import { can } from "~/lib/permissions";
import {
	getCurrentUser,
	getItemByIdOrThrow,
	getUsersWhoCollectedItem,
} from "~/server/api";

export default async function ItemPage(props: {
	params: Promise<{ itemId: string; huntId: string }>;
}) {
	const user = await getCurrentUser();

	const { itemId, huntId } = await props.params;

	const [item, users] = await Promise.all([
		getItemByIdOrThrow(itemId),
		getUsersWhoCollectedItem(itemId),
	]);

	const hasCurrentUserCollected = users.some((_user) => _user.id === user.id);

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">{item.description}</header>
			<div className="text-2xl">Collected By:</div>

			{users.length ? (
				<UsersList users={users} itemId={item.id} huntId={huntId} />
			) : (
				<div className="text-2xl">Nobody, yet 😢</div>
			)}

			{!hasCurrentUserCollected && (
				<Button variant="secondary" asChild>
					<Link href={`/collect?itemId=${item.id}`}>Found It?</Link>
				</Button>
			)}

			{can(user).deleteItem(item) && <DeleteItem id={item.id} />}
		</div>
	);
}
