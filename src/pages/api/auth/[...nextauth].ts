import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";

import { primaryColor } from "~config";
import { createRandomName } from "~lib";
import prisma from "~prisma/client";
import { sendVerificationRequest } from "~util/sendVerificationRequest";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.NEXT_PUBLIC_EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      if (user) {
        const userDoc = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            image:
              user.image ?? `https://picsum.photos/seed/${user.id}/100/100`,
            name: user.name ?? createRandomName(),
          },
        });
        session.user = userDoc;
      }
      return session;
    },
  },
  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
    brandColor: primaryColor, // Hex color value
    logo: "/android-chrome-192x192.png", // Absolute URL to logo image
  },
});
