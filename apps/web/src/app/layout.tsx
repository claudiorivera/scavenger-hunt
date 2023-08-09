import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "~/styles/globals.css";

import { AppBar } from "~/app/app-bar";
import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://scavenger-hunt.claudiorivera.com"),
	title: "Scavenger Hunt",
	description: "A photo scavenger hunt to play with your friends",
	openGraph: {
		title: "Scavenger Hunt",
		description: "A photo scavenger hunt to play with your friends",
		url: "https://scavenger-hunt.claudiorivera.com",
		siteName: "Scavenger Hunt",
	},
	twitter: {
		card: "summary_large_image",
		site: "@atClaudioRivera",
		creator: "@atClaudioRivera",
	},
};

export default function Layout(props: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={["font-sans", fontSans.variable].join(" ")}>
					<TRPCReactProvider>
						<AppBar />
						<main className="container mx-auto max-w-md p-8 text-center">
							{props.children}
						</main>
					</TRPCReactProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
