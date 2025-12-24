import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import * as TanstackQuery from "@/integrations/tanstack-query/root-provider";

import { routeTree } from "@/routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const rqContext = TanstackQuery.getContext();

	const router = createRouter({
		routeTree,
		context: { ...rqContext },
		defaultPreload: "intent",
		Wrap: ({ children }: { children: ReactNode }) => (
			<TooltipProvider>
				<TanstackQuery.Provider {...rqContext}>
					{children}
				</TanstackQuery.Provider>
			</TooltipProvider>
		),
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient,
	});

	return router;
};
