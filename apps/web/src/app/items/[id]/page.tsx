import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DeleteItem } from "~/app/items/[id]/_components/delete-item";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { getInitials } from "~/lib/get-initials";

export default async function ItemPage(props: {
	params: Promise<{ id: string }>;
}) {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	const { id } = await props.params;

	const item = await db.item.findUnique({
		where: {
			id,
		},
	});

	if (!item) return notFound();

	const users = await db.user.findMany({
		where: {
			collectionItems: {
				some: {
					itemId: {
						equals: id,
					},
				},
			},
		},
		include: {
			collectionItems: {
				select: {
					id: true,
					itemId: true,
				},
			},
		},
	});

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

function UsersList({
	users,
	itemId,
}: {
	users: Array<{
		id: string;
		collectionItems: Array<{
			id: string;
			itemId: string;
		}>;
		name: string | null;
		image: string | null;
	}>;
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
