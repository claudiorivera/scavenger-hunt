"use client";

import Link from "next/link";

import { Avatar } from "~/components/Avatar";
import Container from "~/components/Container";
import { api } from "~/utils/api";

export default function LeaderBoardPage() {
	const { data: users = [] } = api.user.all.useQuery();

	return (
		<Container>
			<div className="flex flex-col gap-4">
				<header className="text-5xl">Leaderboard</header>
				<ul className="flex flex-col gap-4">
					{users.map((user) => (
						<li key={user.id} className="flex items-center gap-4">
							<Link
								href={`/users/${user.id}`}
								className="flex w-full items-center gap-4"
							>
								<Avatar imageSrc={user?.imageUrl} size="sm" />
								<div className="flex-1 text-left">
									{user?.firstName} {user?.lastName}
								</div>
								<div className="ml-auto">
									{user._count.collectionItems} items
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</Container>
	);
}
