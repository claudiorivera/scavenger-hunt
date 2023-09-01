import { Text, View } from "react-native";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import { LinkButton } from "~/components/LinkButton";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { useItemDetails } from "~/hooks/useItemDetails";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

export default function ItemPage() {
	const { id } = useLocalSearchParams<{
		id: string;
	}>();
	const { data: currentUser } = api.user.me.useQuery();

	const { users, item, isUncollectedByCurrentUser, isLoading } = useItemDetails(
		{
			id,
			currentUser,
		},
	);

	if (isLoading) return <LoadingSpinner />;

	if (!(item?.id && item.description)) return <NotFound />;

	return (
		<View className="h-full w-full px-4">
			<Stack.Screen
				options={{
					title: item?.description ?? "",
				}}
			/>
			<Text className="mx-auto py-4 text-xl">Collected By:</Text>
			<View className="mb-4">
				{users.length ? (
					<UsersList users={users} item={item} />
				) : (
					<View className="mx-auto">
						<Text className="text-2xl">Nobody, yet 😢</Text>
					</View>
				)}
			</View>
			{isUncollectedByCurrentUser && (
				<LinkButton href={`/collect?itemId=${item.id}`}>Found It?</LinkButton>
			)}
		</View>
	);
}

function UsersList({
	users,
	item,
}: {
	users: RouterOutputs["user"]["withItemIdInCollection"];
	item: NonNullable<RouterOutputs["item"]["byId"]>;
}) {
	return (
		<View className="h-full w-full">
			<FlashList
				data={users}
				estimatedItemSize={120}
				keyExtractor={(user) => user.id}
				renderItem={({ item: user }) => {
					const collectionItem = user.collectionItems.find(
						(collectionItem) => collectionItem.itemId === item.id,
					);

					return (
						<View
							key={user.id}
							className="flex flex-row items-center space-x-2"
						>
							<Avatar imageSrc={user.imageUrl} />
							<View className="flex-1 overflow-hidden">
								<Text className="text-xl">
									{user?.firstName} {user?.lastName}
								</Text>
							</View>
							{!!collectionItem?.id && (
								<LinkButton
									href={`/items/${item.id}/collections/${collectionItem.id}`}
								>
									<Ionicons name="eye" size={24} />
								</LinkButton>
							)}
						</View>
					);
				}}
				ItemSeparatorComponent={() => <View className="h-4" />}
			/>
		</View>
	);
}

function Avatar({ imageSrc }: { imageSrc: string }) {
	return (
		<View className="h-16 w-16 overflow-hidden rounded-full">
			<Image source={imageSrc} className="h-16 w-16" />
		</View>
	);
}

function NotFound() {
	return (
		<View className="h-full w-full px-4 pt-4">
			<Text>Not Found</Text>
		</View>
	);
}
