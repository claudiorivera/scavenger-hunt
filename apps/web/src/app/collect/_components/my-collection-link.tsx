"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function MyCollectionLink() {
	const { data: session } = useSession();

	if (!session) return null;

	return (
		<Button variant="secondary" asChild>
			<Link href={`/users/${session.user.id}`}>My Collection</Link>
		</Button>
	);
}
