import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Menu } from "@/app/_components/menu";
import { MenuSkeleton } from "@/app/_components/menu-skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSessionUser } from "@/server/api";
import "@/styles/globals.css";

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

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const sessionUserPromise = getSessionUser();

	return (
		<html lang="en">
			<body className={fontSans.variable}>
				<TooltipProvider>
					<Toaster />
					<div className="flex bg-primary p-4 text-primary-foreground">
						<div className="flex-1">
							<Link href="/" className="font-bold text-2xl">
								Scavenger Hunt
							</Link>
						</div>
						<Suspense fallback={<MenuSkeleton />}>
							<Menu sessionUserPromise={sessionUserPromise} />
						</Suspense>
					</div>
					<main className="container mx-auto max-w-md p-8 text-center">
						{children}
						<Analytics />
					</main>
				</TooltipProvider>
			</body>
		</html>
	);
}
