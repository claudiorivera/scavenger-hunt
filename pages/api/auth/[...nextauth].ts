import { isNewUserAdminByDefault } from "config";
import middleware from "middleware";
import { User } from "models";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import nextConnect from "next-connect";
import { createRandomName, getRandomImage } from "util/index";
import { sendVerificationRequest } from "util/sendVerificationRequest";

const handler = nextConnect();

handler.use(middleware);

handler.use((req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
      Providers.Email({
        server: process.env.EMAIL_SERVER,
        from: process.env.NEXT_PUBLIC_EMAIL_FROM,
        sendVerificationRequest,
      }),
    ],
    database: process.env.MONGODB_URI,
    secret: process.env.SECRET,
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
      verifyRequest: "/auth/verifyrequest",
    },
    session: {
      jwt: true,
    },
    callbacks: {
      jwt: async (token, user, _account, _profile, isNewUser) => {
        if (user && isNewUser) {
          try {
            const userToUpdate = await User.findByIdAndUpdate(
              user.id,
              {
                name: user.name || createRandomName(),
                image: user.image || (await getRandomImage()),
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
      session: async (session, sessionToken) => {
        session.user.id = sessionToken.uid as string;
        session.user.isAdmin = sessionToken.isAdmin as boolean;
        return Promise.resolve(session);
      },
    },
  })
);

export default handler;
