import { ActivityIndicator, View } from "react-native";

export function LoadingSpinner() {
	return (
		<View className="flex-1 justify-center">
			<ActivityIndicator size="large" />
		</View>
	);
}
