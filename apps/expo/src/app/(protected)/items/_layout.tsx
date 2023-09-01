import React from "react";
import { Stack } from "expo-router";

export default function ItemsStack() {
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: "#BF360C",
				},
				headerTintColor: "#fff",
			}}
		/>
	);
}
