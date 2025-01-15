"use client";

import { useActionState } from "react";
import { createHunt } from "~/app/hunts/create/actions";
import { LoadingButton } from "~/components/loading-button";
import { Input } from "~/components/ui/input";

export function CreateHuntForm() {
	const [_state, action, isPending] = useActionState(createHunt, undefined);

	return (
		<div className="flex flex-col items-center gap-4">
			<form
				id="add-item"
				className="flex w-full flex-col gap-2"
				action={action}
			>
				<Input name="description" placeholder="Something Awesome" />

				<LoadingButton type="submit" variant="secondary" isLoading={isPending}>
					Add Item
				</LoadingButton>
			</form>
		</div>
	);
}
