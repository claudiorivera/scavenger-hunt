import { auth } from "@claudiorivera/auth";

export async function getSessionOrThrow() {
	const session = await auth();

	if (!session) throw Error("Unauthorized");

	return session;
}
