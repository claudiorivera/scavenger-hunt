import "~/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AppBar } from "~/app/_components/app-bar";
import { TooltipProvider } from "~/components/ui/tooltip";

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
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={fontSans.variable}>
				<TooltipProvider>
					<Toaster />
					<AppBar />
					<main className="container mx-auto max-w-md p-8 text-center">
						{children}
					</main>
				</TooltipProvider>
			</body>
		</html>
	);
}
