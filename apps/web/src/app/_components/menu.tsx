import { Role } from "@claudiorivera/db";
import {
	CameraIcon,
	HomeIcon,
	ImagesIcon,
	LogOutIcon,
	MedalIcon,
	MenuIcon,
	UserRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const userLinks = [
	{
		title: "Home",
		url: "/",
		icon: <HomeIcon />,
	},
	{
		title: "Collect",
		url: "/collect",
		icon: <CameraIcon />,
	},
	{
		title: "Leaderboard",
		url: "/leaderboard",
		icon: <MedalIcon />,
	},
	{
		title: "Items",
		url: "/items",
		icon: <ImagesIcon />,
	},
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

export function Menu({ userRole }: { userRole?: Role }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost">
					<MenuIcon />
				</Button>
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
