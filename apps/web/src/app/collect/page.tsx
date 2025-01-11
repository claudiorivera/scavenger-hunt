import Link from "next/link";
import { CollectionLink } from "~/app/collect/_components/collection-link";
import { ImageUpload } from "~/app/collect/_components/image-upload";
import {
	getItemByIdOrThrow,
	getNextUncollectedItemIdForUser,
} from "~/app/collect/_lib/api";
import { Button } from "~/components/ui/button";
import { getSessionOrThrow } from "~/lib/auth-utils";

export default async function CollectPage({
	searchParams,
}: {
	searchParams?: Promise<{ [key: string]: string | Array<string> | undefined }>;
}) {
	const session = await getSessionOrThrow();

	const searchParamsValue = await searchParams;

	const itemId =
		typeof searchParamsValue?.itemId === "string"
			? searchParamsValue.itemId
			: await getNextUncollectedItemIdForUser(session.user.id);

	if (!itemId) {
		return (
			<div className="flex flex-col gap-4">
				<h3>
					You Found All The Items!&nbsp;
					<span role="img" aria-label="celebrate emoji">
						🎉
					</span>
				</h3>

				<CollectionLink userId={session.user.id} />
			</div>
		);
	}

	const item = await getItemByIdOrThrow(itemId);

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
