import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { HiUserCircle } from "react-icons/hi";
import { DeleteUser, SignIn } from "~/components";

import { api } from "~/utils/api";

export default function LeaderboardPage() {
	const { status } = useSession();

	return status === "authenticated" ? <LeaderBoard /> : <SignIn />;
}

function LeaderBoard() {
	const { data: users } = api.users.all.useQuery();
	const { data: currentUser } = api.users.me.useQuery();

	return (
		<div className="flex flex-col gap-4">
			<header className="text-5xl">Leaderboard</header>
			<ul className="flex flex-col gap-4">
				{users?.map((user) => (
					<li key={user.id} className="flex items-center gap-4">
						{currentUser?.role === "ADMIN" && currentUser.id !== user.id && (
							<DeleteUser id={user.id} />
						)}
						<Link
							href={`/users/${user.id}`}
							className="flex w-full items-center gap-4"
						>
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
							<div className="flex-1 text-left">{user.name}</div>
							<div className="ml-auto">{user._count.collectionItems} items</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
