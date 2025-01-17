import Link from "next/link";
import { ImageUpload } from "~/app/hunts/[huntId]/collect/_components/image-upload";
import { Button } from "~/components/ui/button";
import { getSessionOrThrow } from "~/lib/auth-utils";
import {
	getItemByIdOrThrow,
	getNextUncollectedItemIdForUser,
} from "~/server/api";

export default async function CollectPage({
	searchParams,
	params,
}: {
	searchParams?: Promise<{ [key: string]: string | Array<string> | undefined }>;
	params: Promise<{ huntId: string }>;
}) {
	const session = await getSessionOrThrow();

	const searchParamsValue = await searchParams;
	const { huntId } = await params;

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

				<Button variant="secondary" asChild>
					<Link href={`/hunts/${huntId}/users/${session.user.id}`}>
						My Collection
					</Link>
				</Button>
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
				<Link href={`/hunts/${huntId}/items/${item.id}`}>
					See who found this
				</Link>
			</Button>
		</div>
	);
}
