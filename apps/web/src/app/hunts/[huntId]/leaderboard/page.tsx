import Link from "next/link";
import { DeleteUser } from "~/app/hunts/[huntId]/leaderboard/_components/delete-user";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getInitials } from "~/lib/get-initials";
import { can } from "~/lib/permissions";
import { getCurrentUser, getLeaderboardUsers } from "~/server/api";

export default async function LeaderboardPage({
	params,
}: {
	params: Promise<{ huntId: string }>;
}) {
	const currentUser = await getCurrentUser();

	const users = await getLeaderboardUsers();

	const { huntId } = await params;

	return (
		<div className="flex flex-col items-center gap-4">
			<header className="text-5xl">Leaderboard</header>
			<ul className="flex flex-col gap-4">
				{users.map((user) => (
					<li key={user.id} className="flex items-center gap-4">
						{can(currentUser).deleteUser(user) && <DeleteUser id={user.id} />}
						<Link
							href={`/hunts/${huntId}/users/${user.id}`}
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
