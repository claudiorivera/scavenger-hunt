import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";

import prisma from "~/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
    brandColor: "#BF360C", // Hex color code
    logo: "https://scavenger-hunt.claudiorivera.com/android-chrome-512x512.png", // Absolute URL to image
    buttonText: "#FFFFFF", // Hex color code
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: "Demo User",
      credentials: {},
      async authorize() {
        const user = await prisma.user.findFirst({
          where: {
            isAdmin: false,
            isDemoUser: true,
          },
        });

        if (user) return user;

        return null;
      },
    }),
  ],
};

if (process.env.VERCEL_ENV !== "preview") {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    throw new Error("Missing GitHub OAuth environment variables.");
  }
  authOptions.providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}