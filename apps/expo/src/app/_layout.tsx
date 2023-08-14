import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

import { TRPCProvider } from "~/utils/api";
import { tokenCache } from "~/utils/cache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) throw new Error("Missing Clerk publishable key");

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<TRPCProvider>
				<SafeAreaProvider>
					<SignedOut>
						<Stack
							screenOptions={{
								headerStyle: {
									backgroundColor: "#BF360C",
								},
								headerTintColor: "#fff",
							}}
						>
							<Stack.Screen
								name="index"
								options={{
									title: "Scavenger Hunt",
								}}
							/>
						</Stack>
					</SignedOut>
					<SignedIn>
						<Tabs
							screenOptions={{
								headerStyle: {
									backgroundColor: "#BF360C",
								},
								headerTintColor: "#fff",
							}}
						>
							<Tabs.Screen
								name="index"
								options={{
									href: null,
								}}
							/>
							<Tabs.Screen
								name="collect/index"
								options={{
									title: "Collect",
									href: {
										pathname: "/collect",
									},
									tabBarIcon: ({ color, size }) => (
										<Ionicons name="camera" size={size} color={color} />
									),
								}}
							/>
							<Tabs.Screen
								name="leaderboard/index"
								options={{
									title: "Leaderboard",
									href: {
										pathname: "/leaderboard",
									},
									tabBarIcon: ({ color, size }) => (
										<Ionicons name="list" size={size} color={color} />
									),
								}}
							/>
							<Tabs.Screen
								name="items/index"
								options={{
									title: "View Items",
									href: {
										pathname: "/items",
									},
									tabBarIcon: ({ color, size }) => (
										<Ionicons name="ios-newspaper" size={size} color={color} />
									),
								}}
							/>
							<Tabs.Screen
								name="profile/index"
								options={{
									title: "My Profile",
									href: {
										pathname: "/profile",
									},
									tabBarIcon: ({ color, size }) => (
										<Ionicons name="person" size={size} color={color} />
									),
								}}
							/>
						</Tabs>
					</SignedIn>
					<StatusBar />
				</SafeAreaProvider>
			</TRPCProvider>
		</ClerkProvider>
	);
};

export default RootLayout;
