import React from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";

import SignIn from "~/components/SignIn";

const SignOut = () => {
	const { isLoaded, signOut } = useAuth();
	if (!isLoaded) {
		return null;
	}
	return (
		<View>
			<Button
				title="Sign Out"
				onPress={() => {
					void signOut();
				}}
			/>
		</View>
	);
};

function AuthExample() {
	const { isLoaded, userId, sessionId, orgRole } = useAuth();

	// In case the user signs out while on the page.
	if (!isLoaded || !userId) {
		return null;
	}

	return (
		<Text className="text-white">
			{JSON.stringify({ userId, sessionId, orgRole }, null, 2)}
		</Text>
	);
}

const Index = () => {
	return (
		<SafeAreaView className="bg-[#1F104A]">
			{/* Changes page title visible on the header */}
			<Stack.Screen options={{ title: "Home Page" }} />
			<View className="h-full w-full p-4">
				<SignedIn>
					<SignOut />
					<AuthExample />
				</SignedIn>
				<SignedOut>
					<SignIn />
				</SignedOut>
			</View>
		</SafeAreaView>
	);
};

export default Index;
