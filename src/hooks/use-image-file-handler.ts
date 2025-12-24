import { type ChangeEvent, useCallback, useState } from "react";
import { base64FromFile } from "@/lib/file";

export function useImageFileHandler({
	initialSrc,
}: {
	initialSrc?: HTMLImageElement["src"] | null;
} = {}) {
	const [base64, setBase64] = useState<string>();
	const [image, setImage] = useState<
		Pick<HTMLImageElement, "src" | "width" | "height"> | undefined
	>(
		initialSrc
			? {
					src: initialSrc,
					height: 640,
					width: 640,
				}
			: undefined,
	);

	const onFileChange = useCallback(
		async (event: ChangeEvent<HTMLInputElement>) => {
			if (event.currentTarget.files?.[0]) {
				const file = event.currentTarget.files[0];

				const image = new Image();
				image.src = URL.createObjectURL(file);
				image.onload = () => setImage(image);

				const base64string = await base64FromFile(file);

				setBase64(base64string);
			}
		},
		[],
	);

	const clearImage = useCallback(() => setImage(undefined), []);

	return {
		image,
		onFileChange,
		clearImage,
		base64,
	};
}
