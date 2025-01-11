"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";

export default function CollectPageError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className="flex flex-col gap-8">
			<h2>Something went wrong!</h2>
			<Button
				variant="secondary"
				type="button"
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
			>
				Try again
			</Button>
			<Button variant="secondary" asChild>
				<Link href="/">Go Home</Link>
			</Button>
		</div>
	);
}
