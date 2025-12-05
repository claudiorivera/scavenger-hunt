import { EditProfileForm } from "@/app/profile/edit/_components/edit-profile-form";
import { SignInButton } from "@/components/sign-in-button";
import { getSessionUser } from "@/server/api";

export default async function EditProfilePage() {
	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		return <SignInButton />;
	}

	return (
		<div className="flex flex-col items-center">
			<EditProfileForm sessionUser={sessionUser} />
		</div>
	);
}
