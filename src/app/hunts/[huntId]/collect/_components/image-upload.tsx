"use client";

import { CheckIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { createCollectionItemAction } from "@/app/hunts/[huntId]/collect/actions";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks/use-image-upload";
import type { Item } from "@/server/db";

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
				<SelectImage inputOnChange={onFileChange} />
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
	const { huntId } = useParams();
	const router = useRouter();

	const { execute, status, result } = useAction(createCollectionItemAction, {
		onSuccess: ({ data }) => {
			console.dir({ data }, { depth: null });
			router.push(`/hunts/${huntId}/collection-items/${data.id}`);
		},
	});

	console.dir({ result }, { depth: null });

	const isPending = status === "executing";

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
					<form action={execute}>
						<input type="hidden" name="base64" value={base64} />
						<input type="hidden" name="itemId" value={itemId} />
						<input type="hidden" name="huntId" value={huntId} />

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
	inputOnChange,
}: {
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
					hidden
					type="file"
					accept="image/*"
					onChange={inputOnChange}
				/>
			</label>
		</div>
	);
}
