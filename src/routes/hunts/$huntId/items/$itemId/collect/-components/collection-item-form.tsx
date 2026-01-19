import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { CheckIcon, TrashIcon } from "lucide-react";
import {
	type ChangeEventHandler,
	type FormEventHandler,
	useEffect,
} from "react";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@/components/loading-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Item } from "@/db/types";
import { useImageFileHandler } from "@/hooks/use-image-file-handler";
import { useCreateCollectionItem } from "@/routes/hunts/$huntId/items/$itemId/collect/-hooks/use-create-collection-item";
import { uploadCollectionItemSchema } from "@/server-funcs/cloudinary";

const routeApi = getRouteApi("/hunts/$huntId/items/$itemId/collect/");

export function CollectionItemForm({ item }: { item: Item }) {
	const { huntId } = routeApi.useParams();

	const { image, onFileChange, clearImage, base64 } = useImageFileHandler();
	const navigate = useNavigate();

	const form = useForm({
		resolver: zodResolver(uploadCollectionItemSchema),
		defaultValues: {
			itemId: item.id,
		},
	});

	useEffect(() => {
		if (base64) {
			form.setValue("base64", base64);
		}
	}, [base64, form]);

	const { mutate: createCollectionItem, isPending: isPendingCreate } =
		useCreateCollectionItem();

	return (
		<div className="aspect-square w-full max-w-sm">
			{image ? (
				<ImagePreview
					image={image}
					isLoading={isPendingCreate}
					onClear={clearImage}
					onSubmit={form.handleSubmit((values) =>
						createCollectionItem(values, {
							onSuccess: ({ id }) =>
								navigate({
									to: "/hunts/$huntId/collection-items/$collectionItemId",
									params: {
										huntId,
										collectionItemId: id,
									},
								}),
						}),
					)}
				/>
			) : (
				<ImagePicker onFileChange={onFileChange} />
			)}
		</div>
	);
}

function ImagePreview({
	onSubmit,
	onClear,
	image,
	isLoading,
}: {
	onSubmit: FormEventHandler<HTMLFormElement>;
	onClear: () => void;
	image: Pick<HTMLImageElement, "src" | "width" | "height">;
	isLoading: boolean;
}) {
	return (
		<div className="relative h-full w-full overflow-hidden bg-black">
			<img
				src={image.src}
				height={image.height}
				width={image.width}
				className="h-full w-full object-contain"
				alt=""
			/>
			<div className="absolute right-0 bottom-0 left-0">
				<div className="flex justify-center gap-8 p-4">
					<form onSubmit={onSubmit}>
						<LoadingButton
							variant="secondary"
							type="submit"
							isLoading={isLoading}
							aria-label="Confirm"
						>
							<CheckIcon />
						</LoadingButton>
					</form>

					<Button
						type="button"
						variant="destructive"
						onClick={onClear}
						aria-label="Clear"
					>
						<TrashIcon />
					</Button>
				</div>
			</div>
		</div>
	);
}

function ImagePicker({
	onFileChange,
}: {
	onFileChange: ChangeEventHandler<HTMLInputElement>;
}) {
	return (
		<div className="flex h-full w-full items-center justify-center border border-stone-400 bg-stone-100 p-4">
			<Label className={buttonVariants({ variant: "secondary" })}>
				Select image
				<input
					name="base64"
					hidden
					type="file"
					accept="image/*"
					onChange={onFileChange}
				/>
			</Label>
		</div>
	);
}
