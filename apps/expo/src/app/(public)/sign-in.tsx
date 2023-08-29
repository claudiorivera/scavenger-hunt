import { SafeAreaView } from "react-native";

import { GitHubSignInButton } from "~/components/GitHubSignInButton";

export default function SignIn() {
	console.log("(public)/sign-in.tsx SignIn");

	return (
		<SafeAreaView className="m-4 flex-1 justify-center">
			<GitHubSignInButton />
		</SafeAreaView>
	);
}
