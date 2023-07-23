import { redirect } from "next/navigation";

import { auth } from "@claudiorivera/auth";

import { Collect } from "~/app/collect/collect";

export default async function CollectPage() {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	return <Collect />;
}
