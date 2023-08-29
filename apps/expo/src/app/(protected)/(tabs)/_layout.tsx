import React from "react";
import { Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
	console.log("(protected)/(tabs)/_layout.tsx TabsLayout");

	const { isSignedIn } = useAuth();

	return (
		<Tabs
			screenOptions={{
				headerStyle: {
					backgroundColor: "#BF360C",
				},
				headerTintColor: "#fff",
			}}
			initialRouteName="collect/index"
		>
			<Tabs.Screen
				redirect={!isSignedIn}
				name="collect/index"
				options={{
					title: "Collect",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="camera" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				redirect={!isSignedIn}
				name="leaderboard/index"
				options={{
					title: "Leaderboard",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="list" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				redirect={!isSignedIn}
				name="items/index"
				options={{
					title: "All Items",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="ios-newspaper" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				redirect={!isSignedIn}
				name="items/[id]/index"
				options={{
					href: null,
				}}
			/>
			<Tabs.Screen
				redirect={!isSignedIn}
				name="profile/index"
				options={{
					title: "My Profile",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
