import Link from "next/link";
import { Fragment } from "react";
import { Toaster } from "react-hot-toast";

import { auth } from "@claudiorivera/auth";

import { Menu } from "~/app/menu";

export async function AppBar() {
	const session = await auth();

	return (
		<Fragment>
			<div className="navbar bg-primary text-primary-content p-4">
				<div className="flex-1">
					<Link
						href="/"
						className="hover:text-primary-focus text-2xl font-bold"
					>
						Scavenger Hunt
					</Link>
				</div>
				{!!session && <Menu />}
			</div>
			<Toaster />
		</Fragment>
	);
}
