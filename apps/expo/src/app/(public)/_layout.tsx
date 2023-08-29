import React from "react";
import { Stack } from "expo-router";

export default function PublicLayout() {
	return (
		<Stack>
			<Stack.Screen name="sign-in" options={{ title: "Welcome" }} />
		</Stack>
	);
}
