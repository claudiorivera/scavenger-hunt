export async function base64FromFile(file: File) {
	const result = await readFileAsDataURL(file);

	if (typeof result === "string") {
		return result;
	}

	throw Error("Failed to read file as string");
}

function readFileAsDataURL(file: File) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}
