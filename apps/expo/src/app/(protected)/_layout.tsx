import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProtectedLayout() {
	return (
		<Tabs
			screenOptions={{
				headerStyle: {
					backgroundColor: "#BF360C",
				},
				headerTintColor: "#fff",
			}}
		>
			<Tabs.Screen
				name="collect"
				options={{
					title: "Collect",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="camera" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen name="items/[id]/index" options={{ href: null }} />
			<Tabs.Screen
				name="items/index"
				options={{
					title: "All Items",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="ios-newspaper" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
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
