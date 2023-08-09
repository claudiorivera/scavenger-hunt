"use client";

import { Fragment } from "react";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import { Menu } from "~/app/menu";

export function AppBar() {
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
				<SignedIn>
					<Menu />
				</SignedIn>
			</div>
			<Toaster />
		</Fragment>
	);
}
