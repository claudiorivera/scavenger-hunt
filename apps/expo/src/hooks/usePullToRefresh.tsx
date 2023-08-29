import { useState } from "react";

export function usePullToRefresh(refetch: () => Promise<unknown>) {
	const [isRefreshing, setIsRefreshing] = useState(false);

	function onRefresh() {
		setIsRefreshing(true);
		void refetch().finally(() => setIsRefreshing(false));
	}

	return {
		isRefreshing,
		onRefresh,
	};
}
