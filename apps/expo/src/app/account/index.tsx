import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";
import { useAuth, useUser } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

export default function Account() {
	const { signOut } = useAuth();
	const { user } = useUser();

	return (
		<View className="flex h-full flex-col items-center justify-center">
			<Text>{user?.username}</Text>
			<TouchableOpacity onPress={() => signOut()}>
				<Text>Sign Out</Text>
			</TouchableOpacity>
		</View>
	);
}
