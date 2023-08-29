import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

export function useWarmUpBrowser() {
	useEffect(() => {
		void WebBrowser.warmUpAsync();
		return () => {
			void WebBrowser.coolDownAsync();
		};
	}, []);
}
