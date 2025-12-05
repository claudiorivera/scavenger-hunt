import { notFound } from "next/navigation";
import { SignInButton } from "@/components/sign-in-button";
import { can } from "@/lib/permissions";
import { getSessionUser } from "@/server/api";

export default async function AdminPage() {
	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		return <SignInButton />;
	}

	if (!can(sessionUser).viewAdminPanel()) {
		return notFound();
	}

	return "AdminPage";
}
