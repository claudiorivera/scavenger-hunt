"use client";
import { Item } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { z } from "zod";

import { CheckmarkIcon, TrashIcon } from "~/components";
import { useZodForm } from "~/hooks/useZodForm";
import { base64FromFile, htmlImageElementFromFile } from "~/lib/fileHelpers";

const schema = z.object({
	base64: z.string(),
	itemId: z.string().cuid(),
});

const uploadResponseSchema = z.object({
	id: z.string().cuid(),
});

type ImagePreview = Pick<HTMLImageElement, "src" | "width" | "height">;

export type UploadPhotoData = z.infer<typeof schema>;

type Props = {
	itemId: Item["id"];
};

export function PhotoUpload({ itemId }: Props) {
	const router = useRouter();

	const [imagePreview, setImagePreview] = useState<ImagePreview | undefined>();

	const {
		mutate: uploadPhoto,
		isLoading,
		isError,
		error,
	} = useMutation({
		mutationFn: async (uploadPhotoData: UploadPhotoData) => {
			const { data } = await axios.post(
				"/api/collection-items",
				uploadPhotoData,
			);
			return uploadResponseSchema.parse(data);
		},
		onSuccess: ({ id }) => {
			router.refresh();
			router.push(`/collection-items/${id}`);
		},
	});

	const { handleSubmit, register, setValue } = useZodForm({
		schema: schema,
		defaultValues: {
			itemId,
		},
	});

	async function onFileChange(event: FormEvent<HTMLInputElement>) {
		const file = event.currentTarget.files?.[0];

		if (!!file) {
			const image = await htmlImageElementFromFile(file);
			setImagePreview(image);

			const base64 = await base64FromFile(file);

			if (typeof base64 === "string") {
				setValue("base64", base64);
			}
		}
	}

	if (isError) return <div>{JSON.stringify(error, null, 2)}</div>;

	const PhotoSelect = () => {
		if (imagePreview) return null;

		return (
			<div className="flex h-full w-full items-center justify-center border border-stone-400 bg-stone-100 p-4">
				<label>
					<div className="btn btn-secondary">Select photo</div>
					<input
						{...register("base64")}
						hidden
						type="file"
						accept="image/*"
						onChange={onFileChange}
					/>
				</label>
			</div>
		);
	};

	const PhotoPreview = () => {
		if (!imagePreview) return null;

		return (
			<div className="relative h-full w-full overflow-hidden bg-black">
				<Image
					src={imagePreview.src}
					height={imagePreview.height}
					width={imagePreview.width}
					className="h-full w-full object-contain"
					alt=""
				/>
				<div className="absolute bottom-0 left-0 right-0">
					<form
						className="flex justify-center gap-8 p-4"
						onSubmit={handleSubmit((values) => {
							uploadPhoto(values);
						})}
					>
						<button
							className={classNames("btn btn-success btn-circle")}
							type="submit"
							disabled={isLoading}
						>
							<CheckmarkIcon />
						</button>
						<button
							type="button"
							className="btn btn-error btn-circle"
							disabled={isLoading}
							onClick={() => {
								setImagePreview(undefined);
							}}
						>
							<TrashIcon />
						</button>
					</form>
				</div>
			</div>
		);
	};

	return (
		<div className="aspect-square max-w-sm">
			<PhotoSelect />
			<PhotoPreview />
		</div>
	);
}
