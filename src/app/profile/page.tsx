import Link from "next/link";
import { SignInButton } from "@/components/sign-in-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/get-initials";
import { getSessionUser } from "@/server/api";

export default async function ProfilePage() {
	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		return <SignInButton />;
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<Avatar className="h-24 w-24">
					<AvatarImage
						src={sessionUser.image ?? undefined}
						alt={`${sessionUser.name ?? "Anonymous User"}'s profile picture`}
					/>
					<AvatarFallback>{getInitials(sessionUser.name)}</AvatarFallback>
				</Avatar>
				<header className="text-2xl">
					{sessionUser.name ?? "Anonymous User"}
				</header>
				<Button variant="secondary" asChild>
					<Link href="/profile/edit">Edit Profile</Link>
				</Button>
			</div>
		</div>
	);
}
