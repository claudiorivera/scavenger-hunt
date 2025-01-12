"use client";

import type { Item } from "@claudiorivera/db";
import { CheckIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useActionState } from "react";
import { createCollectionItem } from "~/app/collect/actions";
import { LoadingButton } from "~/components/loading-button";
import { Button } from "~/components/ui/button";
import { useImageUpload } from "~/hooks/use-image-upload";

export function ImageUpload({ itemId }: { itemId: Item["id"] }) {
	const { image, onFileChange, clearImage, base64 } = useImageUpload();

	return (
		<div className="aspect-square w-full max-w-sm">
			{image ? (
				<ImagePreview
					base64={base64}
					clearImage={clearImage}
					image={image}
					itemId={itemId}
				/>
			) : (
				<SelectImage inputValue={base64} inputOnChange={onFileChange} />
			)}
		</div>
	);
}

function ImagePreview({
	image,
	base64,
	clearImage,
	itemId,
}: {
	image: Pick<HTMLImageElement, "src" | "width" | "height">;
	base64?: string;
	clearImage: () => void;
	itemId: Item["id"];
}) {
	const [_state, action, isPending] = useActionState(
		createCollectionItem,
		null,
	);

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
				<div className="flex justify-center gap-8 p-4">
					<form action={action}>
						<input type="hidden" name="base64" value={base64} />
						<input type="hidden" name="itemId" value={itemId} />

						<LoadingButton variant="secondary" isLoading={isPending}>
							<CheckIcon />
						</LoadingButton>
					</form>

					<Button type="button" variant="destructive" onClick={clearImage}>
						<TrashIcon />
					</Button>
				</div>
			</div>
		</div>
	);
}

function SelectImage({
	inputValue,
	inputOnChange,
}: {
	inputValue?: string;
	inputOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<div className="flex h-full w-full items-center justify-center border border-stone-400 bg-stone-100 p-4">
			<label>
				<Button variant="secondary" asChild>
					<span className="cursor-pointer">Select image</span>
				</Button>
				<input
					name="base64"
					value={inputValue}
					hidden
					type="file"
					accept="image/*"
					onChange={inputOnChange}
				/>
			</label>
		</div>
	);
}
