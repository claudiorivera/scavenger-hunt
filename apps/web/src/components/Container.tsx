import type { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
	return (
		<div className="container mx-auto max-w-md text-center">{children}</div>
	);
}
