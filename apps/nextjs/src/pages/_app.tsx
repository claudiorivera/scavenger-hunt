import "../styles/globals.css";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import { MainAppBar } from "~/components";

import { api } from "~/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<SessionProvider session={session}>
			<MainAppBar />
			<main className="container mx-auto max-w-md p-8 text-center">
				<Toaster />
				<Component {...pageProps} />
			</main>
		</SessionProvider>
	);
};

export default api.withTRPC(MyApp);
