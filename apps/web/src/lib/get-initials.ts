export function getInitials(fullName?: string | null) {
	if (!fullName) return "";

	return fullName
		.split(" ")
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase();
}
