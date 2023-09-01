import { View } from "react-native";
import { Image } from "expo-image";

export function Avatar({ imageSrc }: { imageSrc: string }) {
	return (
		<View className="h-16 w-16 overflow-hidden rounded-full">
			<Image source={imageSrc} className="h-16 w-16" />
		</View>
	);
}
