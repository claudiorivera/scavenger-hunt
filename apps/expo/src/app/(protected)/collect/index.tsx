import { View } from "react-native";
import { Stack } from "expo-router";

export default function Collect() {
	return (
		<View className="h-full w-full px-4">
			<Stack.Screen
				options={{
					title: "Collect",
				}}
			/>
		</View>
	);
}
