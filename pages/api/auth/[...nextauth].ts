import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import middleware from "middleware";
import User from "models/User";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import nextConnect from "next-connect";
import { createRandomName } from "util/createRandomName";
import clientPromise from "util/mongoDb";
import { sendVerificationRequest } from "util/sendVerificationRequest";

const handler = nextConnect();

handler.use(middleware);

export const nextAuthOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "any username and password",
      credentials: {},
      async authorize() {
        const user = User.findOne();

        if (user) return user;

        return null;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const userDoc = await User.findOneAndUpdate(
        { email: session.user.email },
        {
          email: session.user.email,
          name: session.user.name ?? createRandomName(),
          image:
            session.user.image ??
            `https://picsum.photos/seed/${session.user.email}/100/100`,
          itemsCollected: session.user.itemsCollected ?? [],
        },
        { upsert: true, new: true }
      );

      if (userDoc) {
        session.user = userDoc;
      }

      return session;
    },
  },
};

handler.use((req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, nextAuthOptions)
);

export default handler;
