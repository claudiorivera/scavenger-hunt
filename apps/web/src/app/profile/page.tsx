import { redirect } from "next/navigation";

import { auth } from "@claudiorivera/auth";

import { Profile } from "~/app/profile/profile";

export default async function ProfilePage() {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	return <Profile />;
}
