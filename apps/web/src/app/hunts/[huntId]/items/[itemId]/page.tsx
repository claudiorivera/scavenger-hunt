import Link from "next/link";
import { DeleteItem } from "~/app/hunts/[huntId]/items/[itemId]/_components/delete-item";
import { UsersList } from "~/app/hunts/[huntId]/items/[itemId]/_components/users-list";
import { Button } from "~/components/ui/button";
import { getSessionOrThrow } from "~/lib/auth-utils";
import { getItemByIdOrThrow, getUsersWhoCollectedItem } from "~/server/api";

export default async function ItemPage(props: {
	params: Promise<{ itemId: string; huntId: string }>;
}) {
	const session = await getSessionOrThrow();

	const { itemId, huntId } = await props.params;

	const [item, users] = await Promise.all([
		getItemByIdOrThrow(itemId),
		getUsersWhoCollectedItem(itemId),
	]);

	const hasCurrentUserCollected = users.some(
		(user) => user.id === session.user.id,
	);

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

			{session.user.role === "ADMIN" && <DeleteItem id={item.id} />}
		</div>
	);
}
