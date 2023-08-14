import { Text, View } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import { api } from "~/utils/api";

export default function Items() {
	const { data: uncollectedItems = [] } = api.items.uncollected.useQuery();
	const { data: collectedItems = [] } = api.items.collected.useQuery();

	const totalItems = uncollectedItems.length + collectedItems.length;

	return (
		<View className="flex h-full flex-col items-center gap-4 p-4">
			<Text className="text-5xl">All Items</Text>
			<View>
				<Text>
					Found {collectedItems.length} out of {totalItems} items! 📷
				</Text>
			</View>
			<View className="h-full w-full">
				<FlashList
					data={uncollectedItems}
					renderItem={({ item }) => (
						<View className="flex flex-row items-center gap-2">
							<Link
								className="flex-1 rounded bg-yellow-500 p-2 text-center font-semibold uppercase text-white"
								href={`/items/${item.id}`}
							>
								{item.description}
							</Link>
							<View>
								<MaterialCommunityIcons
									name="minus-circle-outline"
									size={24}
									color="black"
								/>
							</View>
						</View>
					)}
					ItemSeparatorComponent={() => <View className="h-2" />}
					estimatedItemSize={50}
				/>
			</View>
		</View>
	);
}
