import Link from "next/link";
import { redirectToSignIn, useUser } from "@clerk/nextjs";

import { Avatar } from "~/components/Avatar";

export default function HomePage() {
	const { user } = useUser();

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	if (!user) return redirectToSignIn();

	return (
		<div className="flex flex-col items-center gap-4">
			<Avatar imageSrc={user.imageUrl} />
			<header className="text-2xl">{user.username ?? "Anonymous User"}</header>

			<div className="flex w-full flex-col gap-2">
				<Link href={"/collect"} className="btn btn-secondary">
					Collect Items
				</Link>
				<Link href={"/leaderboard"} className="btn btn-secondary">
					Leaderboard
				</Link>
				<Link href={"/items"} className="btn btn-secondary">
					View Items
				</Link>
				<Link href={"/profile"} className="btn btn-secondary">
					My Profile
				</Link>
			</div>
		</div>
	);
}
