import { auth } from "@claudiorivera/auth";
import { redirect } from "next/navigation";

export async function getSessionOrThrow() {
	const session = await auth();

	if (!session) redirect("/sign-in");

	return session;
}
