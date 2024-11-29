import { redirect } from "next/navigation";

import { auth } from "@claudiorivera/auth";

import { Item } from "~/app/items/[id]/item";

export default async function ItemPage(props: {
	params: Promise<{ id: string }>;
}) {
	const params = await props.params;
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	return <Item id={params.id} />;
}
