import { EditProfileForm } from "~/app/profile/edit/_components/edit-profile-form";
import { getCurrentUser } from "~/app/profile/edit/_lib/api";

export default async function EditProfilePage() {
	const user = await getCurrentUser();

	return (
		<div className="flex flex-col items-center">
			<EditProfileForm user={user} />
		</div>
	);
}
