import { SplashScreen, Stack, useSearchParams } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

import { api } from "~/utils/api";

function Item() {
	const { id } = useSearchParams();
	if (!id || typeof id !== "string") throw new Error("unreachable");
	const { data } = api.items.byId.useQuery(id);

	if (!data) return <SplashScreen />;

	return (
		<SafeAreaView className="bg-[#1F104A]">
			<Stack.Screen options={{ title: data.description }} />
			<View className="h-full w-full p-4">
				<Text className="py-2 text-3xl font-bold text-white">
					{data.description}
				</Text>
			</View>
		</SafeAreaView>
	);
}

export default Item;
