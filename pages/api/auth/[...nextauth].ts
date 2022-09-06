import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import User from "models/User";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import { createRandomName } from "util/createRandomName";
import dbConnect from "util/dbConnect";
import clientPromise from "util/mongoDb";
import { sendVerificationRequest } from "util/sendVerificationRequest";

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
        await dbConnect();

        const user = await User.findOne().lean().exec();

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
      await dbConnect();

      try {
        const userDoc = await User.findOne({ email: session.user.email });

        if (!userDoc?.name) {
          userDoc.name = createRandomName();
        }

        if (!userDoc?.image) {
          userDoc.image = `https://picsum.photos/seed/${session.user.email}/100/100`;
        }

        const updatedUserDoc = await userDoc.save();

        if (updatedUserDoc) {
          session.user = updatedUserDoc;
        }
      } catch (error) {
        console.error(error);
      }

      return session;
    },
  },
};

export default NextAuth(nextAuthOptions);
