import { PrismaAdapter } from "@auth/prisma-adapter";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";

import type { User } from "@claudiorivera/db";
import { db } from "@claudiorivera/db";

export type { Session } from "next-auth";

// Update this whenever adding new providers so that the client can
export const providers = ["github", "email", "discord"] as const;
export type OAuthProviders = (typeof providers)[number];

type UserRole = User["role"];

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: UserRole;
		} & DefaultSession["user"];
	}
}

const config = {
	adapter: PrismaAdapter(db),
	providers: [GitHubProvider, DiscordProvider],
	callbacks: {
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
			},
		}),
	},
	theme: {
		colorScheme: "auto", // "auto" | "dark" | "light"
		brandColor: "#BF360C", // Hex color code
		logo: "https://scavenger-hunt.claudiorivera.com/android-chrome-512x512.png", // Absolute URL to image
		buttonText: "#FFFFFF", // Hex color code
	},
} satisfies NextAuthConfig;

export const {
	handlers: { GET, POST },
	auth,
} = NextAuth(config);
