import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@claudiorivera/auth";
import { Avatar } from "~/components/avatar";

export default async function HomePage() {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	return (
		<div className="flex flex-col items-center gap-4">
			<Avatar imageSrc={session.user?.image} />
			<header className="text-2xl">
				{session.user?.name ?? "Anonymous User"}
			</header>

			<div className="flex w-full flex-col gap-2">
				<Link href={"/collect"} className="btn-secondary btn">
					Collect Items
				</Link>
				<Link href={"/leaderboard"} className="btn-secondary btn">
					Leaderboard
				</Link>
				<Link href={"/items"} className="btn-secondary btn">
					View Items
				</Link>
				<Link href={"/profile"} className="btn-secondary btn">
					My Profile
				</Link>
			</div>
		</div>
	);
}
