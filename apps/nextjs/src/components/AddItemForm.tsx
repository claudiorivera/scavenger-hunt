"use client";
import classNames from "classnames";
import { z } from "zod";

import { Input } from "~/components";
import { useZodForm } from "~/hooks/useZodForm";
import { api } from "~/utils/api";

const addItemSchema = z.object({
	description: z.string().min(1),
});

export function AddItemForm() {
	const utils = api.useContext();
	const {
		mutate: addItem,
		isLoading,
		isError,
		error,
	} = api.items.add.useMutation();

	const { register, handleSubmit, reset, formState } = useZodForm({
		schema: addItemSchema,
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
				<Input
					{...register("description")}
					placeholder="Something Awesome"
					error={formState.errors.description?.message}
				/>

				<button
					type="submit"
					className={classNames("btn btn-secondary", {
						loading: isLoading,
					})}
					disabled={isLoading}
				>
					Add Item
				</button>
			</form>
		</div>
	);
}
