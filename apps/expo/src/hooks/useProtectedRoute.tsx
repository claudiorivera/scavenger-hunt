import { useEffect } from "react";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export function useProtectedRoute() {
	const { isLoaded, isSignedIn } = useAuth();
	const segments = useSegments();
	const router = useRouter();
	const navigationState = useRootNavigationState();

	useEffect(() => {
		if (!(navigationState?.key && isLoaded)) return;

		const inTabsGroup = segments[0] === "(protected)";

		if (isSignedIn && !inTabsGroup) {
			router.replace("/items");
		} else if (!isSignedIn) {
			router.replace("/sign-in");
		}
	}, [isSignedIn, isLoaded, segments, router, navigationState?.key]);
}
