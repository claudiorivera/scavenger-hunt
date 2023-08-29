import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";

import { useWarmUpBrowser } from "~/hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export function GitHubSignInButton() {
	useWarmUpBrowser();

	const { startOAuthFlow } = useOAuth({
		strategy: "oauth_github",
	});

	const onPress = React.useCallback(async () => {
		try {
			const { createdSessionId, setActive } = await startOAuthFlow();

			if (createdSessionId && !!setActive) {
				await setActive({ session: createdSessionId });
			}
		} catch (err) {
			console.error("OAuth error", err);
		}
	}, [startOAuthFlow]);

	return (
		<TouchableOpacity onPress={onPress}>
			<View className="m-4 rounded-md bg-yellow-500 p-4">
				<Text className="text-center font-semibold uppercase text-black">
					Sign in with GitHub
				</Text>
			</View>
		</TouchableOpacity>
	);
}
