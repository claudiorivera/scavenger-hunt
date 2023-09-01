import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useAuth, useUser } from "@clerk/clerk-expo";

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
			<View className="items-center py-4">
				<Text>
					{user?.firstName} {user?.lastName}
				</Text>
				<TouchableOpacity onPress={() => signOut()}>
					<Text>Sign Out</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
