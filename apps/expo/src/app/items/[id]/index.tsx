import { Text, View } from "react-native";
import { Tabs, useLocalSearchParams } from "expo-router";

import { api } from "~/utils/api";

export default function ItemPage() {
	const { id } = useLocalSearchParams<{
		id: string;
	}>();

	const { data: item } = api.items.byId.useQuery(id!, {
		enabled: !!id,
	});

	return (
		<>
			<Tabs.Screen
				options={{
					title: item?.description ?? "",
				}}
			/>
			<View>
				<Text>ItemPage</Text>
			</View>
		</>
	);
}
