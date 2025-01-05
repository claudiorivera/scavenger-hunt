"use client";

import type { Item } from "@claudiorivera/db";
import { uploadImageSchema } from "@claudiorivera/shared";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { CheckmarkIcon } from "~/components/checkmark-icon";
import { LoadingButton } from "~/components/loading-button";
import { TrashIcon } from "~/components/trash-icon";
import { Button } from "~/components/ui/button";
import { useZodForm } from "~/hooks/use-zod-form";
import { api } from "~/utils/api";
import { base64FromFile, htmlImageElementFromFile } from "~/utils/file-helpers";

export function ImageUpload({ itemId }: { itemId: Item["id"] }) {
	const router = useRouter();

	const [image, setImage] = useState<
		Pick<HTMLImageElement, "src" | "width" | "height"> | undefined
	>();

	const {
		mutate: uploadImage,
		isLoading,
		isError,
		error,
	} = api.collectionItems.create.useMutation({
		onSuccess: ({ id }) => router.push(`/collection-items/${id}`),
	});

	const { handleSubmit, register, setValue } = useZodForm({
		schema: uploadImageSchema,
		defaultValues: {
			itemId,
		},
	});

	async function onFileChange(event: FormEvent<HTMLInputElement>) {
		const file = event.currentTarget.files?.[0];

		if (file) {
			const img = await htmlImageElementFromFile(file);
			setImage(img);

			const base64 = await base64FromFile(file);

			if (typeof base64 === "string") {
				setValue("base64", base64);
			}
		}
	}

	if (isError) return <div>{JSON.stringify(error, null, 2)}</div>;

	return (
		<div className="aspect-square w-full max-w-sm">
			{image ? (
				<ImagePreview
					image={image}
					onSubmit={handleSubmit((values) => uploadImage(values))}
					onCancel={() => {
						setImage(undefined);
					}}
					isLoading={isLoading}
				/>
			) : (
				<div className="flex h-full w-full items-center justify-center border border-stone-400 bg-stone-100 p-4">
					<label>
						<Button variant="secondary" asChild>
							<span className="cursor-pointer">Select image</span>
						</Button>
						<input
							{...register("base64")}
							hidden
							type="file"
							accept="image/*"
							onChange={onFileChange}
						/>
					</label>
				</div>
			)}
		</div>
	);
}

function ImagePreview({
	image,
	onSubmit,
	onCancel,
	isLoading,
}: {
	image: Pick<HTMLImageElement, "src" | "width" | "height">;
	onSubmit: () => void;
	onCancel: () => void;
	isLoading: boolean;
}) {
	return (
		<div className="relative h-full w-full overflow-hidden bg-black">
			<Image
				src={image.src}
				height={image.height}
				width={image.width}
				className="h-full w-full object-contain"
				alt=""
			/>
			<div className="absolute right-0 bottom-0 left-0">
				<form className="flex justify-center gap-8 p-4" onSubmit={onSubmit}>
					<LoadingButton
						variant="secondary"
						type="submit"
						disabled={isLoading}
						isLoading={isLoading}
					>
						<CheckmarkIcon />
					</LoadingButton>
					<Button
						type="button"
						variant="destructive"
						disabled={isLoading}
						onClick={onCancel}
					>
						<TrashIcon />
					</Button>
				</form>
			</div>
		</div>
	);
}
