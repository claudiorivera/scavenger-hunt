"use client";

import Link from "next/link";
import { Toaster } from "react-hot-toast";

import { api } from "~/utils/api";
import { userLinks } from "~/constants";

export function AppBar() {
	const { data: session } = api.auth.getSession.useQuery();

	function handleDropdownItemClick() {
		document.activeElement instanceof HTMLElement &&
			document.activeElement.blur();
	}

	return (
		<>
			<div className="navbar bg-primary p-4 text-primary-content">
				<div className="flex-1">
					<Link
						href="/"
						className="text-2xl font-bold hover:text-primary-focus"
					>
						Scavenger Hunt
					</Link>
				</div>
				{!!session && (
					<div className="flex-none">
						<div className="dropdown-end dropdown">
							{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
							<label
								// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
								tabIndex={0}
								className="btn-ghost btn-circle btn"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="h-6 w-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
									/>
								</svg>
							</label>
							<ul
								// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
								tabIndex={0}
								className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 text-base-content shadow"
							>
								<>
									{userLinks.map((link) => (
										<li key={link.url}>
											<Link href={link.url} onClick={handleDropdownItemClick}>
												{link.title}
											</Link>
										</li>
									))}
								</>
							</ul>
						</div>
					</div>
				)}
			</div>
			<Toaster />
		</>
	);
}
