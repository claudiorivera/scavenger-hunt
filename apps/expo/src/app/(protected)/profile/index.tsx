import React from "react";
import { Text, View } from "react-native";
import { Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useAuth, useUser } from "@clerk/clerk-expo";

import { Avatar } from "~/components/Avatar";
import { TouchableButton } from "~/components/TouchableButton";

WebBrowser.maybeCompleteAuthSession();

export default function Profile() {
	const { signOut } = useAuth();
	const { user } = useUser();

	return (
		<View className="h-full w-full px-4">
			<Stack.Screen
				options={{
					title: "Profile",
				}}
			/>
			<View className="items-center">
				{!!user?.imageUrl && (
					<View className="pt-4">
						<Avatar imageSrc={user.imageUrl} />
					</View>
				)}
				<Text className="py-4">
					{user?.firstName} {user?.lastName}
				</Text>
				<TouchableButton onPress={() => signOut()}>Sign Out</TouchableButton>
			</View>
		</View>
	);
}
