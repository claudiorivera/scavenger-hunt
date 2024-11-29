import { redirect } from "next/navigation";

import { auth } from "@claudiorivera/auth";

import { CollectionItem } from "~/app/collection-items/[id]/collection-item";

export default async function CollectionItemPage(props: {
	params: Promise<{ id: string }>;
}) {
	const params = await props.params;
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	return <CollectionItem id={params.id} />;
}
