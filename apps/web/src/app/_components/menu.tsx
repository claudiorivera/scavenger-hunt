import { Role, type User } from "@claudiorivera/db";
import { LogOutIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { getInitials } from "~/lib/get-initials";

const userLinks = [
	{
		title: "My Profile",
		url: "/profile",
		icon: <UserRoundIcon />,
	},
	{
		title: "Sign Out",
		url: "/api/auth/signout",
		icon: <LogOutIcon />,
	},
];

const adminLinks = [
	{
		title: "Admin",
		url: "/admin",
		icon: <UserRoundIcon />,
	},
];

export function Menu({ userPromise }: { userPromise: Promise<User> }) {
	const user = use(userPromise);

	const userRole = user?.role ?? Role.USER;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="cursor-pointer outline outline-1 outline-white">
					<AvatarImage src={user?.image ?? undefined} alt="User Avatar" />
					<AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-2" align="end">
				{userLinks.map((link) => (
					<DropdownMenuItem key={link.url} asChild>
						<Link href={link.url} className="cursor-pointer">
							{link.icon}
							<span>{link.title}</span>
						</Link>
					</DropdownMenuItem>
				))}
				{userRole === Role.ADMIN && (
					<>
						<DropdownMenuSeparator />
						{adminLinks.map((link) => (
							<DropdownMenuItem key={link.url} asChild>
								<Link href={link.url} className="cursor-pointer">
									{link.icon}
									<span>{link.title}</span>
								</Link>
							</DropdownMenuItem>
						))}
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
