import { Fragment } from "react";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import { Menu } from "~/app/menu";

export function AppBar() {
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
				<SignedIn>
					<Menu />
				</SignedIn>
			</div>
			<Toaster />
		</Fragment>
	);
}
