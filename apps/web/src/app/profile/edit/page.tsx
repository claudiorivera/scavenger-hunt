import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import { notFound, redirect } from "next/navigation";
import { EditProfile } from "~/app/profile/edit/edit-profile";

export default async function EditProfilePage() {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	const user = await db.user.findUnique({
		where: {
			id: session.user.id,
		},
	});

	if (!user) return notFound();

	return <EditProfile user={user} />;
}
