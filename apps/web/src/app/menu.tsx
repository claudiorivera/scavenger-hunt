import { SignOutButton } from "@clerk/nextjs";

import MenuItem from "~/app/menu-item";
import { userLinks } from "~/constants";

export function Menu() {
	return (
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
				className="dropdown-content menu rounded-box bg-base-100 text-base-content z-10 w-52 p-2 shadow"
			>
				{userLinks.map((link) => (
					<MenuItem key={link.url} link={link} />
				))}
				<li>
					<SignOutButton>Sign Out</SignOutButton>
				</li>
			</ul>
		</div>
	);
}
