import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}

export function getInitials(fullName?: string | null) {
	if (!fullName || !fullName.trim()) return "?";

	return acronymFromString(fullName);
}

function acronymFromString(originalString: string) {
	return originalString
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0)
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase();
}
