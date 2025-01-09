import { auth } from "@claudiorivera/auth";
import Link from "next/link";
import { Menu } from "~/app/_components/menu";

export async function AppBar() {
	const session = await auth();

	return (
		<div className="flex bg-primary p-4 text-primary-foreground">
			<div className="flex-1">
				<Link href="/" className="font-bold text-2xl">
					Scavenger Hunt
				</Link>
			</div>
			<Menu userRole={session?.user.role} />
		</div>
	);
}
