import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { LoadingButton } from "@/components/loading-button";
import { Input } from "@/components/ui/input";
import { useAddItem } from "@/routes/hunts/$huntId/items/-hooks/use-add-item";

export function AddItemForm() {
	const form = useForm({
		resolver: zodResolver(
			z.object({
				description: z.string().min(1, "Description is required"),
			}),
		),
		defaultValues: {
			description: "",
		},
	});

	const { mutate: addItem, isPending: isPendingAdd } = useAddItem();

	return (
		<form
			className="flex flex-col gap-4"
			onSubmit={form.handleSubmit((values) =>
				addItem(values, {
					onSuccess: () => form.reset(),
				}),
			)}
		>
			<Input
				{...form.register("description", { disabled: isPendingAdd })}
				placeholder="Something Awesome"
			/>

			<LoadingButton type="submit" variant="secondary" isLoading={isPendingAdd}>
				Add Item
			</LoadingButton>
		</form>
	);
}
