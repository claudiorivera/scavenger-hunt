"use client";

import Link from "next/link";

export default function MenuItem({
	link,
}: {
	link: { url: string; title: string };
}) {
	return (
		<li>
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
	);
}
