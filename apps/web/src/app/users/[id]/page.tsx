import { redirect } from "next/navigation";

import { auth } from "@claudiorivera/auth";

import { User } from "~/app/users/[id]/user";

export default async function UserPage(props: {
	params: Promise<{ id: string }>;
}) {
	const params = await props.params;
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	return <User id={params.id} />;
}
