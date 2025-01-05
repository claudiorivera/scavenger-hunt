"use client";

import Link from "next/link";
import { ImageUpload } from "~/components/image-upload";
import { Button } from "~/components/ui/button";

export function Collect({
	item,
}: {
	item: {
		description: string;
		id: string;
	};
}) {
	return (
		<div className="flex flex-col gap-4 text-center">
			<header className="text-2xl">Find</header>
			<div className="text-3xl">{item.description}</div>
			<ImageUpload itemId={item.id} />
			<Button variant="secondary" asChild>
				<Link href={`/items/${item.id}`}>See who found this</Link>
			</Button>
		</div>
	);
}
