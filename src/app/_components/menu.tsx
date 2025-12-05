import { ShieldUserIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { SignOutButton } from "@/app/_components/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SessionUser } from "@/lib/auth-client";
import { getInitials } from "@/lib/get-initials";
import { can } from "@/lib/permissions";

export function Menu({
	sessionUserPromise,
}: {
	sessionUserPromise: Promise<SessionUser | undefined>;
}) {
	const sessionUser = use(sessionUserPromise);

	if (!sessionUser) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="cursor-pointer outline-1 outline-white">
					<AvatarImage
						src={sessionUser.image ?? undefined}
						alt={`${sessionUser.name ?? "Anonymous User"}'s profile picture`}
					/>
					<AvatarFallback>{getInitials(sessionUser.name)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-2" align="end">
				<DropdownMenuItem asChild>
					<Link href="/profile" className="cursor-pointer">
						<UserRoundIcon />
						<span>My Profile</span>
					</Link>
				</DropdownMenuItem>
				<SignOutButton />
				{can(sessionUser).viewAdminPanel() && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/admin" className="cursor-pointer">
								<ShieldUserIcon />
								<span>Admin</span>
							</Link>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
