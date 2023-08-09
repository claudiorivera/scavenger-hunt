import type { ExpoConfig } from "@expo/config";

const projectId = process.env.EAS_PROJECT_ID;

const defineConfig = (): ExpoConfig => ({
	name: "scavenger-hunt",
	slug: "scavenger-hunt",
	scheme: "scavenger-hunt",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/icon.png",
	userInterfaceStyle: "light",
	splash: {
		image: "./assets/icon.png",
		resizeMode: "contain",
		backgroundColor: "#1F104A",
	},
	updates: {
		fallbackToCacheTimeout: 0,
	},
	assetBundlePatterns: ["**/*"],
	ios: {
		supportsTablet: true,
		bundleIdentifier: "com.claudiorivera.scavenger-hunt",
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./assets/icon.png",
			backgroundColor: "#1F104A",
		},
	},
	extra: {
		eas: {
			projectId,
		},
	},
	experiments: {
		tsconfigPaths: true,
	},
	plugins: ["./expo-plugins/with-modify-gradle.js"],
});

export default defineConfig;
