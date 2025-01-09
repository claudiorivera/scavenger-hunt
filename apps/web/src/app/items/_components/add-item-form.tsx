"use client";
import { createItemSchema } from "@claudiorivera/shared";
import { LoadingButton } from "~/components/loading-button";
import { Input } from "~/components/ui/input";
import { useZodForm } from "~/hooks/use-zod-form";
import { api } from "~/lib/api";

export function AddItemForm() {
	const utils = api.useContext();
	const {
		mutate: addItem,
		isLoading,
		isError,
		error,
	} = api.items.add.useMutation();

	const { register, handleSubmit, reset } = useZodForm({
		schema: createItemSchema,
	});

	if (isError)
		return (
			<div>
				{error instanceof Error ? error.message : "Something went wrong"}
			</div>
		);

	return (
		<div className="flex flex-col items-center gap-4">
			<form
				id="add-item"
				onSubmit={handleSubmit((values) => {
					addItem(values, {
						onSuccess: () => void utils.items.uncollected.invalidate(),
					});
					reset();
				})}
				className="flex w-full flex-col gap-2"
			>
				<Input {...register("description")} placeholder="Something Awesome" />

				<LoadingButton
					type="submit"
					variant="secondary"
					disabled={isLoading}
					isLoading={isLoading}
				>
					Add Item
				</LoadingButton>
			</form>
		</div>
	);
}
