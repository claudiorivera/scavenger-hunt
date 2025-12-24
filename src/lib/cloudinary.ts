import { v2 as cloudinary } from "cloudinary";

export async function uploadToCloudinary({
	base64,
	filename,
	folder,
}: {
	base64: string;
	filename: string;
	folder: string;
}) {
	const { secure_url, height, width } = await cloudinary.uploader.upload(
		base64,
		{
			public_id: filename,
			folder,
		},
	);

	return { url: secure_url, height, width };
}
