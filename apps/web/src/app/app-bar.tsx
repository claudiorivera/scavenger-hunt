import { Fragment } from "react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

import { auth } from "@claudiorivera/auth";

import { Menu } from "~/app/menu";

export async function AppBar() {
	const session = await auth();

	return (
		<Fragment>
			<div className="navbar bg-primary p-4 text-primary-content">
				<div className="flex-1">
					<Link
						href="/"
						className="text-2xl font-bold hover:text-primary-focus"
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
