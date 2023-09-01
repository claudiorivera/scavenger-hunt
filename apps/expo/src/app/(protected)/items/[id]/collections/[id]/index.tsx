import { Image, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { LinkButton } from "~/components/LinkButton";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { useCollectionItemDetails } from "~/hooks/useCollectionItemDetails";
import { api } from "~/utils/api";

export default function CollectionItem() {
	const { id } = useLocalSearchParams<{
		id: string;
	}>();
	const { data: currentUser } = api.user.me.useQuery();

	const {
		collectionItem,
		title,
		isUncollectedByCurrentUser,
		isCurrentUserOwner,
		isLoading,
	} = useCollectionItemDetails({
		id,
		currentUser,
	});

	if (isLoading) return <LoadingSpinner />;

	return (
		<View className="h-full w-full px-4">
			<Stack.Screen
				options={{
					title: "Collection Item",
					headerBackTitle: "Back",
				}}
			/>
			<Text className="my-4 text-center text-2xl">{title}</Text>
			<View className="aspect-square pb-4">
				{!!collectionItem?.url && (
					<Image
						source={{
							uri: collectionItem.url,
						}}
						width={collectionItem.width}
						height={collectionItem.height}
						alt={title}
						className="h-full w-full bg-black object-contain"
					/>
				)}
			</View>
			{isUncollectedByCurrentUser && !!collectionItem?.item && (
				<View className="pb-4">
					<LinkButton href={`/collect?itemId=${collectionItem.item.id}`}>
						Found It Too?
					</LinkButton>
				</View>
			)}
			{isCurrentUserOwner && (
				<LinkButton href="/collect">Find More Stuff!</LinkButton>
			)}
		</View>
	);
}
