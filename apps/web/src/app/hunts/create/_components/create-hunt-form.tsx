"use client";

import { PlusIcon, TrashIcon } from "lucide-react";
import Form from "next/form";
import { startTransition, useActionState, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { createHunt } from "~/app/hunts/create/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function CreateHuntForm() {
	const [_state, action, isPending] = useActionState(createHunt, undefined);

	const formRef = useRef<HTMLFormElement>(null);
	const { control, register, handleSubmit } = useForm({
		defaultValues: {
			items: [{ description: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<Form
				ref={formRef}
				id="add-item"
				className="flex w-full flex-col gap-4"
				action={action}
				onSubmit={(event) => {
					event.preventDefault();
					handleSubmit(() => {
						startTransition(() =>
							action(new FormData(formRef.current ?? undefined)),
						);
					})(event);
				}}
			>
				<ul className="flex flex-col gap-2">
					{fields.map((field, index) => (
						<li key={field.id} className="flex items-center gap-2">
							<Input
								{...register(`items.${index}.description`)}
								placeholder="Something Awesome"
							/>
							<Button
								variant="destructive"
								type="button"
								onClick={() => remove(index)}
							>
								<TrashIcon />
							</Button>
						</li>
					))}
				</ul>

				<Button
					type="button"
					variant="outline"
					onClick={() => append({ description: "" })}
				>
					<PlusIcon />
				</Button>

				<Button type="submit" variant="secondary" disabled={isPending}>
					Submit
				</Button>
			</Form>
		</div>
	);
}
