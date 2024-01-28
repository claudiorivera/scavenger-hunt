"use client";

import Link from "next/link";
import { Fragment } from "react";

import { userLinks } from "~/constants";

export function Menu() {
	return (
		<div className="dropdown-end dropdown">
			<div tabIndex={0} role="button" className="btn-ghost btn-circle btn">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="h-6 w-6"
				>
					<title>Menu Icon</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</div>
			<ul
				// biome-ignore lint/a11y/noNoninteractiveTabindex: daisyUI limitation
				tabIndex={0}
				className="dropdown-content menu rounded-box bg-base-100 text-base-content w-52 p-2 shadow"
			>
				<Fragment>
					{userLinks.map((link) => (
						<li key={link.url}>
							<Link
								href={link.url}
								onClick={() =>
									document.activeElement instanceof HTMLElement &&
									document.activeElement.blur()
								}
							>
								{link.title}
							</Link>
						</li>
					))}
				</Fragment>
			</ul>
		</div>
	);
}
