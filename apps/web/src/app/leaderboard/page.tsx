import Link from "next/link";
import { DeleteUser } from "~/app/leaderboard/_components/delete-user";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getSessionOrThrow } from "~/lib/auth-utils";
import { getInitials } from "~/lib/get-initials";
import { getLeaderboardUsers } from "~/server/api";

export default async function LeaderboardPage() {
	const session = await getSessionOrThrow();

	const users = await getLeaderboardUsers();

	return (
		<div className="flex flex-col items-center gap-4">
			<header className="text-5xl">Leaderboard</header>
			<ul className="flex flex-col gap-4">
				{users.map((user) => (
					<li key={user.id} className="flex items-center gap-4">
						{session.user.role === "ADMIN" && session.user.id !== user.id && (
							<DeleteUser id={user.id} />
						)}
						<Link
							href={`/users/${user.id}`}
							className="flex w-full items-center gap-4"
						>
							<Avatar>
								<AvatarImage src={user.image ?? undefined} />
								<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
							</Avatar>
							<div className="flex-1 text-left">{user.name}</div>
							<div className="ml-auto">{user._count.collectionItems} items</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
