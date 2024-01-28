import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@claudiorivera/auth";

import { Avatar } from "~/components/avatar";

export default async function ProfilePage() {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<Avatar imageSrc={session.user?.image} />
				<header className="text-2xl">
					{session.user?.name ?? "Anonymous User"}
				</header>
				<Link href={"/profile/edit"} className="btn-secondary btn">
					Edit Profile
				</Link>
			</div>
		</div>
	);
}
