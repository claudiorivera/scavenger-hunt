import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon, TrashIcon } from "lucide-react";
import { type KeyboardEvent, useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateHunt } from "@/routes/hunts/create/-hooks/use-create-hunt";
import { createHuntInputSchema } from "@/server-funcs/hunts";

export function CreateHuntForm() {
	const form = useForm({
		resolver: zodResolver(createHuntInputSchema),
		defaultValues: {
			items: [{ description: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "items",
	});

	const { mutate: createHunt, isPending } = useCreateHunt();

	const navigate = useNavigate();

	const handleAddField = useCallback(
		() => append({ description: "" }),
		[append],
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleAddField();
			}
		},
		[handleAddField],
	);

	return (
		<form
			className="flex w-full flex-col gap-4"
			onSubmit={form.handleSubmit((values) =>
				createHunt(
					{ data: values },
					{
						onSuccess: ({ id }) =>
							navigate({ to: "/hunts/$huntId", params: { huntId: id } }),
					},
				),
			)}
		>
			<ul className="flex flex-col gap-2">
				{fields.map((field, index) => (
					<li key={field.id} className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<Input
								{...form.register(`items.${index}.description`)}
								placeholder="Something awesome"
								onKeyDown={handleKeyDown}
							/>

							<Button
								variant="destructive"
								type="button"
								onClick={() => remove(index)}
								tabIndex={0}
							>
								<TrashIcon />
							</Button>
						</div>

						<p className="text-red-500 text-sm">
							{form.formState.errors.items?.[index]?.description?.message}
						</p>
					</li>
				))}
			</ul>

			<Button type="button" variant="outline" onClick={handleAddField}>
				<PlusIcon />
			</Button>

			{form.formState.errors.items?.root && (
				<p className="text-red-500 text-sm">
					{form.formState.errors.items.root.message}
				</p>
			)}

			<LoadingButton isLoading={isPending} variant="secondary">
				Submit
			</LoadingButton>
		</form>
	);
}
