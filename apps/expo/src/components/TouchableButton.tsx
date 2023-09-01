import { Text, TouchableOpacity, View } from "react-native";

export function TouchableButton({
	children,
	onPress,
}: {
	children: string;
	onPress: () => void;
}) {
	return (
		<TouchableOpacity onPress={onPress}>
			<View className="items-center rounded-md bg-yellow-500 p-4">
				<Text className="font-semibold uppercase text-black">{children}</Text>
			</View>
		</TouchableOpacity>
	);
}
