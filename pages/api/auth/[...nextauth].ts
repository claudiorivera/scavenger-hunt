import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { isNewUserAdminByDefault, primaryColor } from "config";
import middleware from "middleware";
import { User } from "models";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import nextConnect from "next-connect";
import { createRandomName, getRandomImage } from "util/index";
import clientPromise from "util/mongoDb";
import { sendVerificationRequest } from "util/sendVerificationRequest";

const handler = nextConnect();

handler.use(middleware);

handler.use((req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
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
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.SECRET,
    session: {
      strategy: "jwt",
    },
    callbacks: {
      jwt: async ({ token, user, isNewUser }) => {
        if (user && isNewUser) {
          try {
            const randomImage = await getRandomImage();
            const userToUpdate = await User.findByIdAndUpdate(
              user.id,
              {
                name: user.name || createRandomName(),
                image: user.image || randomImage,
                isAdmin: isNewUserAdminByDefault,
                itemsCollected: [],
              },
              { new: true }
            ).exec();

            await userToUpdate.save();
          } catch (error) {
            console.error(error);
          }
        }
        if (user) {
          token.uid = user.id;
          try {
            const existingUser = await User.findById(user.id);
            token.isAdmin = existingUser.isAdmin;
          } catch (error) {
            console.error(error);
          }
        }

        return Promise.resolve(token);
      },
      session: async ({ session, token }) => {
        session.user.id = token.uid as string;
        session.user.isAdmin = token.isAdmin as boolean;
        return Promise.resolve(session);
      },
    },
    theme: {
      colorScheme: "auto", // "auto" | "dark" | "light"
      brandColor: primaryColor, // Hex color value
      logo: "/android-chrome-192x192.png", // Absolute URL to logo image
    },
  })
);

export default handler;
