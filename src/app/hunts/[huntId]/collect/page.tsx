import Link from "next/link";
import z from "zod";
import { ImageUpload } from "@/app/hunts/[huntId]/collect/_components/image-upload";
import { SignInButton } from "@/components/sign-in-button";
import { Button } from "@/components/ui/button";
import {
	getItemByIdOrThrow,
	getNextUncollectedItemId,
	getSessionUser,
} from "@/server/api";

export default async function CollectPage({
	searchParams,
	params,
}: {
	searchParams?: Promise<{ [key: string]: string | Array<string> | undefined }>;
	params: Promise<{ huntId: string }>;
}) {
	const searchParamsValue = await searchParams;
	const { huntId } = await params;

	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		return <SignInButton />;
	}

	const itemIdSearchParam = z
		.object({ itemId: z.string() })
		.safeParse(searchParamsValue);

	const itemId = itemIdSearchParam.success
		? itemIdSearchParam.data.itemId
		: await getNextUncollectedItemId({ userId: sessionUser.id, huntId });

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
					<Link href={`/hunts/${huntId}/users/${sessionUser.id}`}>
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
