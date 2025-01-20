import { CreateHuntForm } from "~/app/hunts/create/_components/create-hunt-form";

export default function CreateHuntPage() {
	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-2xl">Create a Hunt</h1>

			<CreateHuntForm />
		</div>
	);
}
