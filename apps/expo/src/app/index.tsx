import { FlashList } from "@shopify/flash-list";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api, type RouterOutputs } from "~/utils/api";

function ItemCard(props: {
	item: RouterOutputs["item"]["all"][number];
}) {
	const router = useRouter();

	return (
		<View className="flex flex-row rounded-lg bg-white/10 p-4">
			<View className="flex-grow">
				<TouchableOpacity onPress={() => router.push(`/item/${props.item.id}`)}>
					<Text className="text-xl font-semibold text-pink-400">
						{props.item.description}
					</Text>
					<Text className="mt-2 text-white">{props.item.description}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}


const Index = () => {
	const utils = api.useContext();

	const itemQuery = api.item.all.useQuery();


	return (
		<SafeAreaView className="bg-[#1F104A]">
			{/* Changes page title visible on the header */}
			<Stack.Screen options={{ title: "Home Page" }} />
			<View className="h-full w-full p-4">
				<Text className="mx-auto pb-2 text-5xl font-bold text-white">
					Create <Text className="text-pink-400">T3</Text> Turbo
				</Text>

				<Button
					onPress={() => void utils.item.all.invalidate()}
					title="Refresh items"
					color={"#f472b6"}
				/>

				<View className="py-2">
					<Text className="font-semibold italic text-white">
						Press on a item
					</Text>
				</View>

				<FlashList
					data={itemQuery.data}
					estimatedItemSize={20}
					ItemSeparatorComponent={() => <View className="h-2" />}
					renderItem={(p) => (
						<ItemCard
							item={p.item}
						/>
					)}
				/>

			</View>
		</SafeAreaView>
	);
};

export default Index;
