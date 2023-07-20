import { type Item } from "@claudiorivera/db";
import { uploadImageSchema } from "@claudiorivera/shared";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { CheckmarkIcon, TrashIcon } from "~/components";
import { useZodForm } from "~/hooks/useZodForm";
import { api } from "~/utils/api";
import { base64FromFile, htmlImageElementFromFile } from "~/utils/fileHelpers";

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

		if (!!file) {
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
		<div className="aspect-square max-w-sm">
			{!!image ? (
				<ImagePreview
					image={image}
					onSubmit={handleSubmit((values) => uploadImage(values))}
					onCancel={() => {
						setImage(undefined);
					}}
					disabled={isLoading}
				/>
			) : (
				<div className="flex h-full w-full items-center justify-center border border-stone-400 bg-stone-100 p-4">
					<label>
						<div className="btn btn-secondary">Select image</div>
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
	disabled,
}: {
	image: Pick<HTMLImageElement, "src" | "width" | "height">;
	onSubmit: () => void;
	onCancel: () => void;
	disabled: boolean;
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
			<div className="absolute bottom-0 left-0 right-0">
				<form className="flex justify-center gap-8 p-4" onSubmit={onSubmit}>
					<button
						className={classNames("btn btn-success btn-circle", {
							"btn-loading": disabled,
						})}
						type="submit"
						disabled={disabled}
					>
						<CheckmarkIcon />
					</button>
					<button
						type="button"
						className="btn btn-error btn-circle"
						disabled={disabled}
						onClick={onCancel}
					>
						<TrashIcon />
					</button>
				</form>
			</div>
		</div>
	);
}
