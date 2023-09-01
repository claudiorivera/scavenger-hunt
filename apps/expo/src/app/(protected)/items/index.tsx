import { Text, View } from "react-native";
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import colors from "tailwindcss/colors";

import { LinkButton } from "~/components/LinkButton";
import { api } from "~/utils/api";

export default function Items() {
	const { data: uncollectedItems = [] } = api.item.uncollected.useQuery();
	const { data: collectedItems = [] } = api.item.collected.useQuery();

	const totalItems = uncollectedItems.length + collectedItems.length;

	return (
		<View className="h-full w-full px-4">
			<Stack.Screen
				options={{
					title: "Items",
				}}
			/>
			<FlashList
				ListHeaderComponent={() => (
					<View className="my-4">
						<Text className="mx-auto">
							Found {collectedItems.length} out of {totalItems} items! 📷
						</Text>
					</View>
				)}
				data={uncollectedItems.concat(collectedItems)}
				renderItem={({ item }) => (
					<View className="flex flex-row items-center space-x-2">
						<View className="flex-1">
							<LinkButton href={`/items/${item.id}`}>
								{item.description}
							</LinkButton>
						</View>
						<View>
							{item.isCollected ? (
								<MaterialCommunityIcons
									name="check-circle-outline"
									size={24}
									color={colors.green[500]}
								/>
							) : (
								<MaterialCommunityIcons
									name="minus-circle-outline"
									size={24}
									color={colors.yellow[500]}
								/>
							)}
						</View>
					</View>
				)}
				ItemSeparatorComponent={() => <View className="h-2" />}
				estimatedItemSize={50}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
