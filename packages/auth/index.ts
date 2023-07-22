import GitHubProvider from "@auth/core/providers/github";
import type { DefaultSession } from "@auth/core/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import type { User } from "@claudiorivera/db";
import { prisma } from "@claudiorivera/db";

import { env } from "./env.mjs";

type UserRole = User["role"];

export type { Session } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: UserRole;
		} & DefaultSession["user"];
	}
}

export const {
	handlers: { GET, POST },
	auth,
	CSRF_experimental,
} = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		GitHubProvider({
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		}),
	],
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
});
