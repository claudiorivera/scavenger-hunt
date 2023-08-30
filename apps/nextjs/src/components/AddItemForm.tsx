"use client";

import classNames from "classnames";

import { createItemSchema } from "@claudiorivera/shared";

import { api } from "~/utils/api";
import { Input } from "~/components/Input";
import { useZodForm } from "~/hooks/useZodForm";

export function AddItemForm() {
	const utils = api.useContext();
	const {
		mutate: addItem,
		isLoading,
		isError,
		error,
	} = api.item.add.useMutation();

	const { register, handleSubmit, reset, formState } = useZodForm({
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
						onSuccess: () => void utils.item.uncollected.invalidate(),
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
					className={classNames("btn-secondary btn", {
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
