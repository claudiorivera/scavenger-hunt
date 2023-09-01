import { View } from "react-native";
import { Stack } from "expo-router";

export default function CollectionItem() {
	return (
		<View className="h-full w-full px-4">
			<Stack.Screen
				options={{
					title: "Collection Item",
					headerBackTitle: "Back",
				}}
			/>
		</View>
	);
}
