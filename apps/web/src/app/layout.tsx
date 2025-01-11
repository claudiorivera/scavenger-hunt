import "~/styles/globals.css";

import { auth } from "@claudiorivera/auth";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { Menu } from "~/app/_components/menu";
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

export default async function Layout({
	children,
}: { children: React.ReactNode }) {
	const session = await auth();

	return (
		<html lang="en">
			<body className={fontSans.variable}>
				<SessionProvider>
					<TooltipProvider>
						<Toaster />
						<div className="flex bg-primary p-4 text-primary-foreground">
							<div className="flex-1">
								<Link href="/" className="font-bold text-2xl">
									Scavenger Hunt
								</Link>
							</div>
							<Menu userRole={session?.user.role} />
						</div>
						<main className="container mx-auto max-w-md p-8 text-center">
							{children}
						</main>
					</TooltipProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
