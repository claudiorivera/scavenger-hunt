import { prisma, type User } from "@claudiorivera/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { env } from "../env.mjs";

type UserRole = User["role"];

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			role: UserRole;
		} & DefaultSession["user"];
	}

	interface User {
		role: UserRole;
	}
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
	callbacks: {
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
			},
		}),
	},
	adapter: PrismaAdapter(prisma),
	providers: [],
};

if (env.VERCEL_ENV !== "preview") {
	if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
		throw new Error("Missing GitHub OAuth environment variables.");
	}
	authOptions.providers.push(
		GithubProvider({
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		}),
	);
}