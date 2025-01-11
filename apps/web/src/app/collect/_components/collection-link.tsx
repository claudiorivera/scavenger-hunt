import Link from "next/link";
import { Button } from "~/components/ui/button";

export function CollectionLink({ userId }: { userId: string }) {
	return (
		<Button variant="secondary" asChild>
			<Link href={`/users/${userId}`}>My Collection</Link>
		</Button>
	);
}
