import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Redirect, useRootNavigationState } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useOAuth, useUser } from "@clerk/clerk-expo";

import { useWarmUpBrowser } from "~/hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export default function Home() {
	const { isLoaded, isSignedIn } = useUser();
	const navigationState = useRootNavigationState();

	if (isLoaded && isSignedIn) {
		// https://github.com/expo/router/issues/740
		if (!navigationState?.key) return;

		return <Redirect href="/items" />;
	}

	return (
		<View className="flex h-full flex-col justify-center">
			<SignIn />
		</View>
	);
}

const SignIn = () => {
	useWarmUpBrowser();

	const { startOAuthFlow } = useOAuth({ strategy: "oauth_github" });

	const onPress = React.useCallback(async () => {
		try {
			const { createdSessionId, setActive } = await startOAuthFlow();

			if (createdSessionId) {
				await setActive?.({ session: createdSessionId });
			} else {
				// Use signIn or signUp for next steps such as MFA
			}
		} catch (err) {
			console.error("OAuth error", err);
		}
	}, [startOAuthFlow]);

	return (
		<View className="m-4 rounded-md bg-yellow-500 p-4">
			<TouchableOpacity onPress={onPress}>
				<Text className="text-center font-semibold uppercase text-black">
					Sign in with GitHub
				</Text>
			</TouchableOpacity>
		</View>
	);
};
