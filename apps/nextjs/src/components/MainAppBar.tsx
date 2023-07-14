"use client";

import Link from "next/link";

import { userLinks } from "~/constants";

export function MainAppBar() {
	function handleDropdownItemClick() {
		document.activeElement instanceof HTMLElement &&
			document.activeElement.blur();
	}

	return (
		<div className="navbar bg-primary text-primary-content p-4">
			<div className="flex-1">
				<Link href="/" className="hover:text-primary-focus text-2xl font-bold">
					Scavenger Hunt
				</Link>
			</div>
			<div className="flex-none">
				<div className="dropdown dropdown-end">
					<label tabIndex={0} className="btn btn-ghost btn-circle">
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
						tabIndex={0}
						className="dropdown-content menu bg-base-100 text-base-content rounded-box w-52 p-2 shadow"
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
		</div>
	);
}
