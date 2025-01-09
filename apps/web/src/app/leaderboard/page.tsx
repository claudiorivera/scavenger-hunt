import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteUser } from "~/components/delete-user";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getInitials } from "~/lib/get-initials";

export default async function LeaderboardPage() {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	const users = await db.user.findMany({
		include: {
			_count: true,
		},
	});

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
