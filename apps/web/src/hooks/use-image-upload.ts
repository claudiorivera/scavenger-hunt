import { type ChangeEvent, useCallback, useState } from "react";
import { base64FromFile } from "~/utils/file-helpers";

export function useImageUpload({
	initialSrc,
	onSuccess,
}: {
	initialSrc?: HTMLImageElement["src"] | null;
	onSuccess: (base64: string) => void;
}) {
	const [image, setImage] = useState<
		Partial<Pick<HTMLImageElement, "src" | "width" | "height">>
	>({
		src: initialSrc ?? undefined,
		height: 100,
		width: 100,
	});

	const onFileChange = useCallback(
		async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
			if (event.currentTarget.files?.[0]) {
				const file = event.currentTarget.files[0];

				const image = new Image();
				image.src = URL.createObjectURL(file);
				image.onload = () => setImage(image);

				const base64string = await base64FromFile(file);

				if (typeof base64string === "string") {
					onSuccess(base64string);
				}
			}
		},
		[onSuccess],
	);

	return {
		image,
		onFileChange,
	};
}
