import { SafeAreaView } from "react-native";
import { Stack } from "expo-router";

import { GitHubSignInButton } from "~/components/GitHubSignInButton";

export default function SignIn() {
	return (
		<SafeAreaView className="m-4 flex-1 justify-center">
			<Stack.Screen
				options={{
					title: "Scavenger Hunt",
					headerStyle: {
						backgroundColor: "#BF360C",
					},
					headerTintColor: "#fff",
				}}
			/>
			<GitHubSignInButton />
		</SafeAreaView>
	);
}
