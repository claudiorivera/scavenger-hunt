import { AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { getSessionOrThrow } from "~/lib/auth-utils";
import { getInitials } from "~/lib/get-initials";

export default async function ProfilePage() {
	const session = await getSessionOrThrow();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<Avatar className="h-24 w-24">
					<AvatarImage src={session.user.image ?? undefined} />
					<AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
				</Avatar>
				<header className="text-2xl">
					{session.user.name ?? "Anonymous User"}
				</header>
				<Button variant="secondary" asChild>
					<Link href="/profile/edit">Edit Profile</Link>
				</Button>
			</div>
		</div>
	);
}
