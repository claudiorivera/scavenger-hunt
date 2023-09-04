"use client";

import Link from "next/link";

import { Avatar } from "~/components/Avatar";
import { DeleteUser } from "~/components/DeleteUser";
import { api } from "~/utils/api";

export function LeaderBoard() {
	const { data: users = [] } = api.users.all.useQuery();
	const { data: currentUser } = api.users.me.useQuery();

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">Leaderboard</header>
			<ul className="flex flex-col gap-4">
				{users.map((user) => (
					<li key={user.id} className="flex items-center gap-4">
						{currentUser?.role === "ADMIN" && currentUser.id !== user.id && (
							<DeleteUser id={user.id} />
						)}
						<Link
							href={`/users/${user.id}`}
							className="flex w-full items-center gap-4"
						>
							<Avatar imageSrc={user.image} size="sm" />
							<div className="flex-1 text-left">{user.name}</div>
							<div className="ml-auto">{user._count.collectionItems} items</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
