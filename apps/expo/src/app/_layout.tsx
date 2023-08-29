import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";

import { TRPCProvider } from "~/utils/api";
import { tokenCache } from "~/utils/cache";
import { useProtectedRoute } from "~/hooks/useProtectedRoute";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) throw new Error("Missing Clerk publishable key");

const RootLayout = () => {
	console.log("_layout.tsx RootLayout");

	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<TRPCProvider>
				<SafeAreaProvider>
					<Layout />
					<StatusBar />
				</SafeAreaProvider>
			</TRPCProvider>
		</ClerkProvider>
	);
};

export default RootLayout;

function Layout() {
	console.log("_layout.tsx Layout");

	useProtectedRoute();

	return <Slot />;
}
