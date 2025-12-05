export function getInitials(fullName?: string | null) {
	if (!fullName || !fullName.trim()) return "?";

	return fullName
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0)
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase()
		.slice(0, 2);
}
