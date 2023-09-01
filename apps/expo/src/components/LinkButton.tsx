import type { ReactNode } from "react";
import { View } from "react-native";
import { Link } from "expo-router";

export function LinkButton({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) {
	return (
		<View className="items-center rounded-md bg-yellow-500 p-4">
			<Link className="font-semibold uppercase text-black" href={href}>
				{children}
			</Link>
		</View>
	);
}
