import { CreateHuntForm } from "@/app/hunts/create/_components/create-hunt-form";
import { SignInButton } from "@/components/sign-in-button";
import { getSessionUser } from "@/server/api";

export default async function CreateHuntPage() {
	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		return <SignInButton />;
	}

	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-2xl">Create a Hunt</h1>

			<CreateHuntForm />
		</div>
	);
}
