import Link from "next/link";
import { DeleteItem } from "~/app/items/[id]/_components/delete-item";
import { UsersList } from "~/app/items/[id]/_components/users-list";
import { Button } from "~/components/ui/button";
import { getSessionOrThrow } from "~/lib/auth-utils";
import { getItemByIdOrThrow, getUsersWhoCollectedItem } from "~/server/api";

export default async function ItemPage(props: {
	params: Promise<{ id: string }>;
}) {
	const session = await getSessionOrThrow();

	const { id } = await props.params;

	const [item, users] = await Promise.all([
		getItemByIdOrThrow(id),
		getUsersWhoCollectedItem(id),
	]);

	const hasCurrentUserCollected = users.some(
		(user) => user.id === session.user.id,
	);

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">{item.description}</header>
			<div className="text-2xl">Collected By:</div>

			{users.length ? (
				<UsersList users={users} itemId={item.id} />
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
