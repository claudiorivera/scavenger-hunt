import { Text, View } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import colors from "tailwindcss/colors";

import { api } from "~/utils/api";

export default function Items() {
	const { data: uncollectedItems = [] } = api.item.uncollected.useQuery();
	const { data: collectedItems = [] } = api.item.collected.useQuery();

	const totalItems = uncollectedItems.length + collectedItems.length;

	return (
		<View className="h-full w-full px-4 pt-4">
			<FlashList
				ListHeaderComponent={() => (
					<View className="mx-auto mb-4">
						<Text>
							Found {collectedItems.length} out of {totalItems} items! 📷
						</Text>
					</View>
				)}
				data={uncollectedItems}
				renderItem={({ item }) => (
					<View className="flex flex-row items-center gap-2">
						<View className="flex-1 rounded-md bg-yellow-500 p-4">
							<Link
								className="text-center font-semibold uppercase text-black"
								href={`/items/${item.id}`}
							>
								{item.description}
							</Link>
						</View>
						<View>
							<MaterialCommunityIcons
								name="minus-circle-outline"
								size={24}
								color={colors.yellow[500]}
							/>
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
